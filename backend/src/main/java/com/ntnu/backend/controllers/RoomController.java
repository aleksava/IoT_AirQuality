package com.ntnu.backend.controllers;

import com.ntnu.backend.DAO.RoomRepository;
import com.ntnu.backend.models.entities.Room;
import com.ntnu.backend.models.entities.user.BaseUser;
import com.ntnu.backend.models.entities.user.Organization;
import com.ntnu.backend.models.requests.rooms.CreateRoomRequest;
import com.ntnu.backend.models.responses.ErrorMessage;
import io.swagger.annotations.Api;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@Api
@Controller
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @GetMapping("")
    public ResponseEntity<List<Room>> getRoomsInOrganization(@AuthenticationPrincipal Jwt jwt){
        return ResponseEntity.ok(roomRepository.findAllInOrg(jwt.getClaim("http://AQ/orgId")));
    }


    @PostMapping("/create_new")
    public ResponseEntity<Room> createNewRoom(@AuthenticationPrincipal Jwt jwt,
                                              @Valid @RequestBody CreateRoomRequest createRoomRequest){

        Organization organization = Organization.fromId(jwt.getClaim("http://AQ/orgId"));
        BaseUser user = BaseUser.fromUsername(jwt.getClaim("http://AQ/username"));

        return ResponseEntity.ok(roomRepository.save(createRoomRequest.toRoom(organization, user)));
    }


    @PutMapping("/update/{roomId}")
    public ResponseEntity<?> updateRoom(@AuthenticationPrincipal Jwt jwt, @PathVariable long roomId,
                                           @Valid @RequestBody CreateRoomRequest updateRoomRequest){

        Optional<Room> roomOptional = roomRepository.findById(roomId);
        if(roomOptional.isEmpty() || roomOptional.get().getOrganizationId() != (long) jwt.getClaim("http://AQ/orgId")){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ErrorMessage.ROOM_NOT_IN_YOUR_ORGANIZATION);
        }

        Room room = roomOptional.get();
        room.setRoomName(updateRoomRequest.getRoomName());

        return ResponseEntity.ok(roomRepository.save(room));
    }


}
