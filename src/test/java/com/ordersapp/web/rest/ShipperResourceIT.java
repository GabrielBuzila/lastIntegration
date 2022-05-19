package com.ordersapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ordersapp.IntegrationTest;
import com.ordersapp.domain.Shipper;
import com.ordersapp.repository.ShipperRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ShipperResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ShipperResourceIT {

    private static final String DEFAULT_SHIPPER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_SHIPPER_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/shippers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ShipperRepository shipperRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restShipperMockMvc;

    private Shipper shipper;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Shipper createEntity(EntityManager em) {
        Shipper shipper = new Shipper().shipperName(DEFAULT_SHIPPER_NAME).phone(DEFAULT_PHONE);
        return shipper;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Shipper createUpdatedEntity(EntityManager em) {
        Shipper shipper = new Shipper().shipperName(UPDATED_SHIPPER_NAME).phone(UPDATED_PHONE);
        return shipper;
    }

    @BeforeEach
    public void initTest() {
        shipper = createEntity(em);
    }

    @Test
    @Transactional
    void createShipper() throws Exception {
        int databaseSizeBeforeCreate = shipperRepository.findAll().size();
        // Create the Shipper
        restShipperMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shipper))
            )
            .andExpect(status().isCreated());

        // Validate the Shipper in the database
        List<Shipper> shipperList = shipperRepository.findAll();
        assertThat(shipperList).hasSize(databaseSizeBeforeCreate + 1);
        Shipper testShipper = shipperList.get(shipperList.size() - 1);
        assertThat(testShipper.getShipperName()).isEqualTo(DEFAULT_SHIPPER_NAME);
        assertThat(testShipper.getPhone()).isEqualTo(DEFAULT_PHONE);
    }

    @Test
    @Transactional
    void createShipperWithExistingId() throws Exception {
        // Create the Shipper with an existing ID
        shipper.setId(1L);

        int databaseSizeBeforeCreate = shipperRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restShipperMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shipper))
            )
            .andExpect(status().isBadRequest());

        // Validate the Shipper in the database
        List<Shipper> shipperList = shipperRepository.findAll();
        assertThat(shipperList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllShippers() throws Exception {
        // Initialize the database
        shipperRepository.saveAndFlush(shipper);

        // Get all the shipperList
        restShipperMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shipper.getId().intValue())))
            .andExpect(jsonPath("$.[*].shipperName").value(hasItem(DEFAULT_SHIPPER_NAME)))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)));
    }

    @Test
    @Transactional
    void getShipper() throws Exception {
        // Initialize the database
        shipperRepository.saveAndFlush(shipper);

        // Get the shipper
        restShipperMockMvc
            .perform(get(ENTITY_API_URL_ID, shipper.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(shipper.getId().intValue()))
            .andExpect(jsonPath("$.shipperName").value(DEFAULT_SHIPPER_NAME))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE));
    }

    @Test
    @Transactional
    void getNonExistingShipper() throws Exception {
        // Get the shipper
        restShipperMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewShipper() throws Exception {
        // Initialize the database
        shipperRepository.saveAndFlush(shipper);

        int databaseSizeBeforeUpdate = shipperRepository.findAll().size();

        // Update the shipper
        Shipper updatedShipper = shipperRepository.findById(shipper.getId()).get();
        // Disconnect from session so that the updates on updatedShipper are not directly saved in db
        em.detach(updatedShipper);
        updatedShipper.shipperName(UPDATED_SHIPPER_NAME).phone(UPDATED_PHONE);

        restShipperMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedShipper.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedShipper))
            )
            .andExpect(status().isOk());

        // Validate the Shipper in the database
        List<Shipper> shipperList = shipperRepository.findAll();
        assertThat(shipperList).hasSize(databaseSizeBeforeUpdate);
        Shipper testShipper = shipperList.get(shipperList.size() - 1);
        assertThat(testShipper.getShipperName()).isEqualTo(UPDATED_SHIPPER_NAME);
        assertThat(testShipper.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    @Transactional
    void putNonExistingShipper() throws Exception {
        int databaseSizeBeforeUpdate = shipperRepository.findAll().size();
        shipper.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShipperMockMvc
            .perform(
                put(ENTITY_API_URL_ID, shipper.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shipper))
            )
            .andExpect(status().isBadRequest());

        // Validate the Shipper in the database
        List<Shipper> shipperList = shipperRepository.findAll();
        assertThat(shipperList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchShipper() throws Exception {
        int databaseSizeBeforeUpdate = shipperRepository.findAll().size();
        shipper.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShipperMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(shipper))
            )
            .andExpect(status().isBadRequest());

        // Validate the Shipper in the database
        List<Shipper> shipperList = shipperRepository.findAll();
        assertThat(shipperList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamShipper() throws Exception {
        int databaseSizeBeforeUpdate = shipperRepository.findAll().size();
        shipper.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShipperMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(shipper))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Shipper in the database
        List<Shipper> shipperList = shipperRepository.findAll();
        assertThat(shipperList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateShipperWithPatch() throws Exception {
        // Initialize the database
        shipperRepository.saveAndFlush(shipper);

        int databaseSizeBeforeUpdate = shipperRepository.findAll().size();

        // Update the shipper using partial update
        Shipper partialUpdatedShipper = new Shipper();
        partialUpdatedShipper.setId(shipper.getId());

        restShipperMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShipper.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShipper))
            )
            .andExpect(status().isOk());

        // Validate the Shipper in the database
        List<Shipper> shipperList = shipperRepository.findAll();
        assertThat(shipperList).hasSize(databaseSizeBeforeUpdate);
        Shipper testShipper = shipperList.get(shipperList.size() - 1);
        assertThat(testShipper.getShipperName()).isEqualTo(DEFAULT_SHIPPER_NAME);
        assertThat(testShipper.getPhone()).isEqualTo(DEFAULT_PHONE);
    }

    @Test
    @Transactional
    void fullUpdateShipperWithPatch() throws Exception {
        // Initialize the database
        shipperRepository.saveAndFlush(shipper);

        int databaseSizeBeforeUpdate = shipperRepository.findAll().size();

        // Update the shipper using partial update
        Shipper partialUpdatedShipper = new Shipper();
        partialUpdatedShipper.setId(shipper.getId());

        partialUpdatedShipper.shipperName(UPDATED_SHIPPER_NAME).phone(UPDATED_PHONE);

        restShipperMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedShipper.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedShipper))
            )
            .andExpect(status().isOk());

        // Validate the Shipper in the database
        List<Shipper> shipperList = shipperRepository.findAll();
        assertThat(shipperList).hasSize(databaseSizeBeforeUpdate);
        Shipper testShipper = shipperList.get(shipperList.size() - 1);
        assertThat(testShipper.getShipperName()).isEqualTo(UPDATED_SHIPPER_NAME);
        assertThat(testShipper.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    @Transactional
    void patchNonExistingShipper() throws Exception {
        int databaseSizeBeforeUpdate = shipperRepository.findAll().size();
        shipper.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restShipperMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, shipper.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shipper))
            )
            .andExpect(status().isBadRequest());

        // Validate the Shipper in the database
        List<Shipper> shipperList = shipperRepository.findAll();
        assertThat(shipperList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchShipper() throws Exception {
        int databaseSizeBeforeUpdate = shipperRepository.findAll().size();
        shipper.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShipperMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shipper))
            )
            .andExpect(status().isBadRequest());

        // Validate the Shipper in the database
        List<Shipper> shipperList = shipperRepository.findAll();
        assertThat(shipperList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamShipper() throws Exception {
        int databaseSizeBeforeUpdate = shipperRepository.findAll().size();
        shipper.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restShipperMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(shipper))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Shipper in the database
        List<Shipper> shipperList = shipperRepository.findAll();
        assertThat(shipperList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteShipper() throws Exception {
        // Initialize the database
        shipperRepository.saveAndFlush(shipper);

        int databaseSizeBeforeDelete = shipperRepository.findAll().size();

        // Delete the shipper
        restShipperMockMvc
            .perform(delete(ENTITY_API_URL_ID, shipper.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Shipper> shipperList = shipperRepository.findAll();
        assertThat(shipperList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
