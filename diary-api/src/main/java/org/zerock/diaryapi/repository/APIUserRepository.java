package org.zerock.diaryapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.diaryapi.domain.APIUser;

public interface APIUserRepository extends JpaRepository<APIUser, String> {
}
