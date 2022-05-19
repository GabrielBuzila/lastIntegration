package com.ordersapp.repository;

import com.ordersapp.domain.Shipper;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Shipper entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShipperRepository extends JpaRepository<Shipper, Long> {}
