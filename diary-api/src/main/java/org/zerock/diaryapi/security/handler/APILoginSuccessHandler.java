package org.zerock.diaryapi.security.handler;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.zerock.diaryapi.util.JWTUtil;

import java.io.IOException;
import java.util.Map;

@Log4j2
@RequiredArgsConstructor
public class APILoginSuccessHandler implements AuthenticationSuccessHandler {
  private final JWTUtil jwtUtil;

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
    log.info("Login Success Handler.......................");
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    log.info(authentication);
    log.info(authentication.getName());

    Map<String, Object> claim = Map.of("mid",authentication.getName());
    String accessToken = jwtUtil.generateToken(claim,1);
    String refreshToken = jwtUtil.generateToken(claim,30);
    String mid = authentication.getName();
    Gson gson = new Gson();
    Map<String,String> keyMap = Map.of("accessToken",accessToken, "refreshToken", refreshToken, "mid", mid);
    String jsonStr = gson.toJson(keyMap);
    response.getWriter().println(jsonStr);
  }
}
