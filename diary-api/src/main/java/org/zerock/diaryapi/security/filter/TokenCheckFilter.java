package org.zerock.diaryapi.security.filter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;
import org.zerock.diaryapi.security.APIUserDetailsService;
import org.zerock.diaryapi.security.exception.AccessTokenException;
import org.zerock.diaryapi.util.JWTUtil;

import java.io.IOException;
import java.util.Map;

@Log4j2
@RequiredArgsConstructor
public class TokenCheckFilter extends OncePerRequestFilter {
  private final APIUserDetailsService userDetailsService;
  private final JWTUtil jwtUtil;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    String path = request.getRequestURI();
    if(!path.startsWith("/diary/")){
      filterChain.doFilter(request, response);
      return;
    }
    log.info("Token Check Filter.........................");
    log.info("JWTUtil:" + jwtUtil);
    try{
      Map<String,Object> payload = validateAccessToken(request);

      String mid = (String)payload.get("mid");

      UserDetails userDetails = userDetailsService.loadUserByUsername(mid);

      UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

      SecurityContextHolder.getContext().setAuthentication(authentication);

      filterChain.doFilter(request, response);
    }catch(AccessTokenException accessTokenException){
      accessTokenException.sendResponseError(response);
    }

  }
  //토큰이 정상인지 아닌지 확인하는 메서드
  private Map<String,Object> validateAccessToken(HttpServletRequest request) throws AccessTokenException {
    // Authorization : type+인증값
    // JWT는 Bearer 타입을 사용
    // type의 종류 : Basic, Bearer, Digest, HOBA, Mutual
    String headerStr = request.getHeader("Authorization");
    if(headerStr == null || headerStr.length() < 8){
      throw new AccessTokenException(AccessTokenException.TOKEN_ERROR.UNACCEPT);
    }
    //Bearer 타입확인
    String tokenType = headerStr.substring(0,6);
    String tokenStr = headerStr.substring(7);
    if(tokenType.equalsIgnoreCase("Bearer") == false){
      throw new AccessTokenException(AccessTokenException.TOKEN_ERROR.BADTYPE);
    }

    try{
      Map<String,Object> values = jwtUtil.validateToken(tokenStr);
      return values;
    }catch(MalformedJwtException malformedJwtException){
      log.error("MalformedJwtException--------------------");
      throw new AccessTokenException(AccessTokenException.TOKEN_ERROR.MALFORM);
    }catch(SignatureException signatureException){
      log.error("SignatureException-----------------------");
      throw new AccessTokenException(AccessTokenException.TOKEN_ERROR.BADSIGN);
    }catch(ExpiredJwtException expiredJwtException){
      log.error("ExpiredJwtException----------------------");
      throw new AccessTokenException(AccessTokenException.TOKEN_ERROR.EXPRIRED);
    }
  }
}
