package org.zerock.diaryapi.service;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.zerock.diaryapi.domain.Diary;
import org.zerock.diaryapi.dto.DiaryDTO;
import org.zerock.diaryapi.repository.DiaryRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiaryServiceImpl implements DiaryService {
    private final DiaryRepository diaryRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<DiaryDTO> getList(String name) {
        List<Diary> diaries = diaryRepository.findByName(name);
        return diaries.stream().map((diary)->
                modelMapper.map(diary,DiaryDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public DiaryDTO get(Long id) {
        Diary diary = diaryRepository.findById(id).orElseThrow();
        return modelMapper.map(diary,DiaryDTO.class);
    }

    @Override
    public void add(DiaryDTO diaryDTO) {
        Diary diary = modelMapper.map(diaryDTO, Diary.class);
        diaryRepository.save(diary);
    }

    @Override
    public void modify(DiaryDTO diaryDTO) {
        Diary diary = diaryRepository.findById(diaryDTO.getId()).orElseThrow();
        diary.change(diaryDTO.getDate(), diaryDTO.getContent() , diaryDTO.getEmotionId());
        diaryRepository.save(diary);
    }

    @Override
    public void remove(Long id) {
        diaryRepository.deleteById(id);
    }
}
