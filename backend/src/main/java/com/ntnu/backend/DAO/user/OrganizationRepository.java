package com.ntnu.backend.DAO.user;

import com.ntnu.backend.models.entities.user.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
}
