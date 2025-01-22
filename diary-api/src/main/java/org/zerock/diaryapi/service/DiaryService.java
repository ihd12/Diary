package org.zerock.diaryapi.service;

import org.zerock.diaryapi.dto.DiaryDTO;

import java.util.List;

public interface DiaryService {
    List<DiaryDTO> getList(String name);
    DiaryDTO get(Long id);
    void add(DiaryDTO diaryDTO);
    void modify(DiaryDTO diaryDTO);
    void remove(Long id);
}
