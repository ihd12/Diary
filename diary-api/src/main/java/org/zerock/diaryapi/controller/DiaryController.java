package org.zerock.diaryapi.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.zerock.diaryapi.dto.DiaryDTO;
import org.zerock.diaryapi.service.DiaryService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/diary")
public class DiaryController {
    private final DiaryService diaryService;

    @GetMapping("/list/{name}")
    public List<DiaryDTO> getDiaryList(@PathVariable("name") String name) {
        return diaryService.getList(name);
    }
    @GetMapping("/{id}")
    public DiaryDTO getDiary(@PathVariable Long id) {
        return diaryService.get(id);
    }
    @PostMapping(value="/", produces= MediaType.APPLICATION_JSON_VALUE)
    public void addDiary(@RequestBody DiaryDTO diaryDTO) {
        diaryService.add(diaryDTO);
    }

    @PutMapping(value="/", produces= MediaType.APPLICATION_JSON_VALUE)
    public void updateDiary(@RequestBody DiaryDTO diaryDTO) {
        diaryService.modify(diaryDTO);
    }
    @DeleteMapping("/{id}")
    public void deleteDiary(@PathVariable Long id) {
        diaryService.remove(id);
    }
}
