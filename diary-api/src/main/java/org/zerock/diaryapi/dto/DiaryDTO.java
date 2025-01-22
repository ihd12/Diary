package org.zerock.diaryapi.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DiaryDTO {
    private Long id;
    private String name;
    private LocalDateTime date;
    private String content;
    private int emotionId;
}
