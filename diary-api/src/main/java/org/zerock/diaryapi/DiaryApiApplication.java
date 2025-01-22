package org.zerock.diaryapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class DiaryApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(DiaryApiApplication.class, args);
    }

}
