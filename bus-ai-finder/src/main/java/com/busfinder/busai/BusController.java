package com.busfinder.busai;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BusController {

    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    @GetMapping("/buses")
    public List<Bus> searchBuses(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam String startTime,
            @RequestParam String endTime,
            @RequestParam(required = false) String busType) {

        return busService.searchBuses(
                source,
                destination,
                startTime,
                endTime,
                busType
        );
    }
}