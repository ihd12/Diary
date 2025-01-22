package org.zerock.diaryapi.security.filter;

import com.google.gson.Gson;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;
import org.zerock.diaryapi.security.exception.RefreshTokenException;
import org.zerock.diaryapi.util.JWTUtil;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Log4j2
@RequiredArgsConstructor
public class RefreshTokenFilter extends OncePerRequestFilter {
  private final String refreshPath;
  private final JWTUtil jwtUtil;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    // 요청 url path 변수에 저장 ,취득
    String path = request.getRequestURI();
    // 요청 url이 refreshPath가 아니면 필터로 처리하지 않고 처리 끝
    if(!path.equals(refreshPath)){
      log.info("skip refresh token filter .....");
      filterChain.doFilter(request,response);
      return;
    }
    log.info("Refresh Token Filter ... run ...............1");
    //request에서 토큰 데이터를 변수에 저장
    Map<String, String> tokens = parseRequestJSON(request);
    //accessToken 과 refreshToken을 변수에 저장
    String accessToken = tokens.get("accessToken");
    String refreshToken = tokens.get("refreshToken");
    //로그 출력
    log.info("accessToken : " + accessToken);
    log.info("refreshToken : " + refreshToken);

    //AccessToken 확인
    try{
      checkAccessToken(accessToken);
    }catch(RefreshTokenException refreshTokenException){
      refreshTokenException.sendResponseError(response);
    }
    //try문 안에서 선언 변수는 try문 밖에서는 사용할 수 없기 때문에 밖에서 먼저 선언
    Map<String, Object> refreshClaims = null;
    try{
      //refreshToken의 확인
      refreshClaims = checkRefreshToken(refreshToken);
      log.info(refreshClaims);
      // 토큰의 만료기한을 변수에 저장
      Integer exp = (Integer) refreshClaims.get("exp");
      // Integer 값으로 저장된 만료기한을 시간타입으로 변환
      Date expTime = new Date(Instant.ofEpochMilli(exp).toEpochMilli()*1000);
      // 현재시간을 밀리세컨드 단위로 취득
      Date current = new Date(System.currentTimeMillis());
      //만료 기한과 현재시간을 빼서 몇일의 시간이 남았는지 저장
      long gapTime = (expTime.getTime() - current.getTime());
      log.info("-----------------------------");
      log.info("current: "+current);
      log.info("expTime: "+expTime);
      log.info("gap: "+gapTime);
      // 토큰을 생성할때 저장할 mid를 취득
      String mid = (String)refreshClaims.get("mid");
      //새로운 accessToken 생성
      String accessTokenValue = jwtUtil.generateToken(Map.of("mid",mid),1);
      // 기존에 존재하던 refreshToken을 저장
      String refreshTokenValue = tokens.get("refreshToken");
      //gapTime이 3일보다 적으면 새로운 refreshToken을 생성
      if(gapTime < (1000*60*60*24*3)){
        log.info("time : "+(1000*60*60*24*3));
        log.info("new Refresh Token required... ");
        refreshTokenValue = jwtUtil.generateToken(Map.of("mid",mid),30);
      }
      log.info("Refresh Token result..................");
      log.info("accessToken: "+accessTokenValue);
      log.info("refreshToken: "+refreshTokenValue);
      // 요청페이지에 새로운 토큰들을 보내주는 처리
      sendTokens(accessTokenValue,refreshTokenValue,response);

    }catch(RefreshTokenException refreshTokenException){
      refreshTokenException.sendResponseError(response);
      return;
    }

  }
  // request의 토큰 데이터를 Map<String,String> 으로 변경
  private Map<String, String> parseRequestJSON(HttpServletRequest request) {
    try(Reader reader = new InputStreamReader(request.getInputStream())){
      Gson gson = new Gson();
      return gson.fromJson(reader, Map.class);
    }catch(Exception e){
      log.error(e.getMessage());
    }
    return null;
  }
  // 액세스 토큰이 정상인지 확인하는 메서드
  private void checkAccessToken(String accessToken) {
    try{
      jwtUtil.validateToken(accessToken);
    }catch(ExpiredJwtException e){
      log.info("Access Token has expired");
    }catch(Exception e){
      throw new RefreshTokenException(RefreshTokenException.ErrorCase.NO_ACCESS);
    }
  }
  //
  private Map<String, Object> checkRefreshToken(String refreshToken){
    try{
      Map<String, Object> values = jwtUtil.validateToken(refreshToken);
      return values;
    }catch(ExpiredJwtException expiredJwtException){
      throw new RefreshTokenException(RefreshTokenException.ErrorCase.OLD_REFRESH);
    }catch(MalformedJwtException malformedJwtExceptione){
      log.info("MalformedJwtException---------------------");
      throw new RefreshTokenException(RefreshTokenException.ErrorCase.NO_REFRESH);
    }catch(Exception exception){
      new RefreshTokenException(RefreshTokenException.ErrorCase.NO_REFRESH);
    }
    return null;
  }

  private void sendTokens(String accessTokenValue, String refreshTokenValue, HttpServletResponse response){
    // JSON타입으로 응답하기 위한 설정
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    // 각 토큰을 JSON형식으로 변환
    Gson gson = new Gson();
    String jsonStr = gson.toJson(Map.of("accessToken", accessTokenValue, "refreshToken", refreshTokenValue));
    try{
      // response에 토큰들을 설정
      response.getWriter().println(jsonStr);
    }catch(IOException e){
      throw new RuntimeException(e);
    }
  }
}











