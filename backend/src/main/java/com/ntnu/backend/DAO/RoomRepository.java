package com.ntnu.backend.DAO;

import com.ntnu.backend.models.entities.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    @Query(value = "SELECT * FROM room WHERE organization=?1", nativeQuery = true)
    List<Room> findAllInOrg(long orgId);

}
