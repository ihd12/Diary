package org.zerock.diaryapi.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.zerock.diaryapi.security.APIUserDetailsService;
import org.zerock.diaryapi.security.filter.APILoginFilter;
import org.zerock.diaryapi.security.filter.RefreshTokenFilter;
import org.zerock.diaryapi.security.filter.TokenCheckFilter;
import org.zerock.diaryapi.security.handler.APILoginSuccessHandler;
import org.zerock.diaryapi.util.JWTUtil;

import java.util.Arrays;

@Configuration
@Log4j2
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class CustomSecurityConfig {
  private final APIUserDetailsService apiUserDetailsService;
  private final JWTUtil jwtUtil;

  @Bean
  public PasswordEncoder passwordEncoder(){
    // 암호화 설정
    return new BCryptPasswordEncoder();
  }
  @Bean
  public WebSecurityCustomizer webSecurityCustomizer(){
    log.info("---------------web configure-----------------");
    // 정적 파일 요청 무시하는 설정
    return (web) -> web.ignoring()
        .requestMatchers(PathRequest.toStaticResources().atCommonLocations());
  }

  @Bean
  public SecurityFilterChain filterChain (final HttpSecurity http) throws Exception {
    log.info("---------------configure-----------------------");
//     인증 관리자 생성위한 빌더 생성
    AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
    //인증 관리자 빌더를 사용하여 userDetailsSevice 설정과 passwordEncoder 설정
    authenticationManagerBuilder
        .userDetailsService(apiUserDetailsService)
            .passwordEncoder(passwordEncoder());
    // 인증관리자 빌더를 통해 인증관리자를 생성
    AuthenticationManager authenticationManager = authenticationManagerBuilder.build();
    //http에 인증관리자 설정
    http.authenticationManager(authenticationManager);

    // APILoginFilter 를 불러올때 사용할 URL 설정
    APILoginFilter apiLoginFilter = new APILoginFilter("/generateToken");
    //APILoginFilter가 위에서 만든 인증 관리자를 사용할지 설정
    apiLoginFilter.setAuthenticationManager(authenticationManager);

    //APILoginSuccessHandler 선언
    APILoginSuccessHandler successHandler = new APILoginSuccessHandler(jwtUtil);
    //SuccessHandler 세팅
    apiLoginFilter.setAuthenticationSuccessHandler(successHandler);

    // APILoginFilter 전에 실행할 필터를 설정
    http.addFilterBefore(apiLoginFilter, UsernamePasswordAuthenticationFilter.class);

    http.addFilterBefore(
        tokenCheckFilter(jwtUtil, apiUserDetailsService),
        UsernamePasswordAuthenticationFilter.class
    );
    //TokenCheckFilter실행되기 전 RefreshTokenFilter가 실행됨
    http.addFilterBefore(new RefreshTokenFilter("/refreshToken",jwtUtil), TokenCheckFilter.class);

    //csrf 설정 끄기
    http.csrf().disable();
    // 세션 생생 설정 끄기
    http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

    //CORS 설정
    http.cors(httpSecurityCorsConfigurer -> httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource()));

    return http.build();
  }
  private TokenCheckFilter tokenCheckFilter(JWTUtil jwtUtil, APIUserDetailsService apiUserDetailsService){
    return new TokenCheckFilter(apiUserDetailsService,jwtUtil);
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource(){
    CorsConfiguration configuration = new CorsConfiguration();
    // 모든 패턴을 허락
    // origin의 의미 : protocol+host+port
    // protocol : http://, https://
    // host : 도메인(localhost, www.naver.com, www.google.com)이나 ip주소
    // port : :80, :8080, :3306
    configuration.addAllowedOrigin("http://localhost:3000");
//    configuration.setAllowedOriginPatterns(Arrays.asList("*"));
    // Ajax에서 실행할 메서드 설정
    configuration.setAllowedMethods(Arrays.asList("HEAD","GET","POST","PUT","DELETE"));
    // 사용할 헤더 설정
    configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control","Content-Type"));
    //cors설정을 사용 설정
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**",configuration);
    return source;
  }
}















