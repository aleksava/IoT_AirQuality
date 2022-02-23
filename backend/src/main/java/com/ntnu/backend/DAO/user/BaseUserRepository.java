package com.ntnu.backend.DAO.user;

import com.ntnu.backend.models.entities.user.BaseUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BaseUserRepository extends JpaRepository<BaseUser, String> {
}
