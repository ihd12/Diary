package org.zerock.diaryapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.zerock.diaryapi.domain.Diary;

import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary,Long> {
    @Query("SELECT d FROM Diary d WHERE d.name = :name")
    List<Diary> findByName(String name);
}
