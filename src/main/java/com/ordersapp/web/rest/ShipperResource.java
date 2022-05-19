package com.ordersapp.web.rest;

import com.ordersapp.domain.Shipper;
import com.ordersapp.repository.ShipperRepository;
import com.ordersapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.ordersapp.domain.Shipper}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ShipperResource {

    private final Logger log = LoggerFactory.getLogger(ShipperResource.class);

    private static final String ENTITY_NAME = "shipper";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShipperRepository shipperRepository;

    public ShipperResource(ShipperRepository shipperRepository) {
        this.shipperRepository = shipperRepository;
    }

    /**
     * {@code POST  /shippers} : Create a new shipper.
     *
     * @param shipper the shipper to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shipper, or with status {@code 400 (Bad Request)} if the shipper has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/shippers")
    public ResponseEntity<Shipper> createShipper(@RequestBody Shipper shipper) throws URISyntaxException {
        log.debug("REST request to save Shipper : {}", shipper);
        if (shipper.getId() != null) {
            throw new BadRequestAlertException("A new shipper cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Shipper result = shipperRepository.save(shipper);
        return ResponseEntity
            .created(new URI("/api/shippers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /shippers/:id} : Updates an existing shipper.
     *
     * @param id the id of the shipper to save.
     * @param shipper the shipper to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shipper,
     * or with status {@code 400 (Bad Request)} if the shipper is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shipper couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/shippers/{id}")
    public ResponseEntity<Shipper> updateShipper(@PathVariable(value = "id", required = false) final Long id, @RequestBody Shipper shipper)
        throws URISyntaxException {
        log.debug("REST request to update Shipper : {}, {}", id, shipper);
        if (shipper.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shipper.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shipperRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Shipper result = shipperRepository.save(shipper);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, shipper.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /shippers/:id} : Partial updates given fields of an existing shipper, field will ignore if it is null
     *
     * @param id the id of the shipper to save.
     * @param shipper the shipper to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shipper,
     * or with status {@code 400 (Bad Request)} if the shipper is not valid,
     * or with status {@code 404 (Not Found)} if the shipper is not found,
     * or with status {@code 500 (Internal Server Error)} if the shipper couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/shippers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Shipper> partialUpdateShipper(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Shipper shipper
    ) throws URISyntaxException {
        log.debug("REST request to partial update Shipper partially : {}, {}", id, shipper);
        if (shipper.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shipper.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shipperRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Shipper> result = shipperRepository
            .findById(shipper.getId())
            .map(existingShipper -> {
                if (shipper.getShipperName() != null) {
                    existingShipper.setShipperName(shipper.getShipperName());
                }
                if (shipper.getPhone() != null) {
                    existingShipper.setPhone(shipper.getPhone());
                }

                return existingShipper;
            })
            .map(shipperRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, shipper.getId().toString())
        );
    }

    /**
     * {@code GET  /shippers} : get all the shippers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shippers in body.
     */
    @GetMapping("/shippers")
    public List<Shipper> getAllShippers() {
        log.debug("REST request to get all Shippers");
        return shipperRepository.findAll();
    }

    /**
     * {@code GET  /shippers/:id} : get the "id" shipper.
     *
     * @param id the id of the shipper to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the shipper, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/shippers/{id}")
    public ResponseEntity<Shipper> getShipper(@PathVariable Long id) {
        log.debug("REST request to get Shipper : {}", id);
        Optional<Shipper> shipper = shipperRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(shipper);
    }

    /**
     * {@code DELETE  /shippers/:id} : delete the "id" shipper.
     *
     * @param id the id of the shipper to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/shippers/{id}")
    public ResponseEntity<Void> deleteShipper(@PathVariable Long id) {
        log.debug("REST request to delete Shipper : {}", id);
        shipperRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
