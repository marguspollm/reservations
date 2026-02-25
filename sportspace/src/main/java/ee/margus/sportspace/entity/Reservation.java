package ee.margus.sportspace.entity;

import ee.margus.sportspace.model.ReservationStatus;
import ee.margus.sportspace.model.ReservationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reservation extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReservationInstance> instances = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private ReservationStatus status = ReservationStatus.REQUESTED;

    @Enumerated(EnumType.STRING)
    private ReservationType type;
}
