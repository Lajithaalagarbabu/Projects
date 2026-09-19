package com.busfinder.busai;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class BusService {

	public List<Bus> getAllBuses() {

	    List<Bus> buses = new ArrayList<>();

	    // Madurai → Chennai
	    buses.add(new Bus("Madurai", "Chennai", "18:30", "Sleeper"));
	    buses.add(new Bus("Madurai", "Chennai", "19:15", "AC Sleeper"));
	    buses.add(new Bus("Madurai", "Chennai", "20:00", "Seater"));
	    buses.add(new Bus("Madurai", "Chennai", "21:30", "Sleeper"));
	    buses.add(new Bus("Madurai", "Chennai", "22:15", "AC Sleeper"));
	    buses.add(new Bus("Madurai", "Chennai", "23:00", "Seater"));

	    // Chennai → Madurai
	    buses.add(new Bus("Chennai", "Madurai", "18:00", "Sleeper"));
	    buses.add(new Bus("Chennai", "Madurai", "19:30", "AC Sleeper"));
	    buses.add(new Bus("Chennai", "Madurai", "21:00", "Sleeper"));
	    buses.add(new Bus("Chennai", "Madurai", "22:30", "Seater"));

	    // Other route
	    buses.add(new Bus("Madurai", "Bangalore", "19:00", "Sleeper"));
	    buses.add(new Bus("Madurai", "Coimbatore", "20:30", "Seater"));

	    return buses;
	}

    public List<Bus> searchBuses(
            String source,
            String destination,
            String startTime,
            String endTime,
            String busType) {

        List<Bus> results = new ArrayList<>();

        for (Bus bus : getAllBuses()) {

            boolean sourceMatch =
                    bus.getSource().equalsIgnoreCase(source);

            boolean destinationMatch =
                    bus.getDestination().equalsIgnoreCase(destination);

            boolean typeMatch =
                    busType == null ||
                    busType.isBlank() ||
                    bus.getBusType().equalsIgnoreCase(busType);

            boolean timeMatch =
                    bus.getDepartureTime().compareTo(startTime) >= 0 &&
                    bus.getDepartureTime().compareTo(endTime) <= 0;

            if (sourceMatch &&
                destinationMatch &&
                typeMatch &&
                timeMatch) {

                results.add(bus);
            }
        }

        return results;
    }
}