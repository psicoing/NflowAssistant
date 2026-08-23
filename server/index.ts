import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import bcrypt from "bcrypt";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { registerSeoMiddleware } from "./seo-middleware";
import { pool } from "./db";

async function ensureAdminUser() {
  try {
    const hash = await bcrypt.hash("mln328RMR+", 10);
    const existing = await pool.query(
      `SELECT id FROM users WHERE username = 'rmolons'
       UNION
       SELECT id FROM users WHERE email = 'rmportbou@gmail.com' AND username != 'rmolons'
       LIMIT 1`
    );
    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE users SET username = 'rmolons', email = 'rmportbou@gmail.com', password = $1,
         role = 'admin', subscription_status = 'active', profile_completed = true
         WHERE id = $2`,
        [hash, existing.rows[0].id]
      );
      log("Admin user rmolons updated");
    } else {
      await pool.query(
        `INSERT INTO users (username, email, password, role, subscription_status, profile_completed)
         VALUES ('rmolons', 'rmportbou@gmail.com', $1, 'admin', 'active', true)`,
        [hash]
      );
      log("Admin user rmolons created");
    }
  } catch (err: any) {
    console.error("ensureAdminUser error:", err.message);
  }
}

async function ensureLeadTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wellness_test_leads (
        id SERIAL PRIMARY KEY,
        email TEXT,
        phq9_score INT,
        gad7_score INT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS burnout_calculator_leads (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        empleados INT,
        salario INT,
        sector TEXT,
        total_coste NUMERIC,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    log("Lead tables ensured");
  } catch (err: any) {
    console.error("ensureLeadTables error:", err.message);
  }
}

async function ensureEmpresasTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS empresa_contacts (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        company TEXT,
        company_size TEXT DEFAULT 'unclassified',
        company_size_source TEXT DEFAULT 'seed',
        opted_out BOOLEAN DEFAULT false,
        opted_out_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        contact_type TEXT DEFAULT 'empresa'
      );
      CREATE TABLE IF NOT EXISTS empresa_campaign_history (
        id SERIAL PRIMARY KEY,
        sent_at TIMESTAMPTZ DEFAULT NOW(),
        subject TEXT NOT NULL,
        sent_count INT DEFAULT 0,
        failed_count INT DEFAULT 0,
        opens INT DEFAULT 0,
        companies_filter TEXT,
        sizes_filter TEXT,
        scheduled_at TIMESTAMPTZ,
        status TEXT DEFAULT 'sent',
        subject_b TEXT,
        body TEXT
      );
      CREATE TABLE IF NOT EXISTS empresa_email_tracking (
        id SERIAL PRIMARY KEY,
        campaign_id INT REFERENCES empresa_campaign_history(id) ON DELETE CASCADE,
        contact_email TEXT NOT NULL,
        resend_message_id TEXT,
        opened_at TIMESTAMPTZ,
        subject_variant TEXT DEFAULT 'a'
      );
      CREATE TABLE IF NOT EXISTS empresa_email_templates (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    // Add language column if the table already existed without it
    await pool.query(`
      ALTER TABLE empresa_contacts ADD COLUMN IF NOT EXISTS language TEXT;
      ALTER TABLE empresa_contacts ADD COLUMN IF NOT EXISTS company_size TEXT DEFAULT 'unclassified';
      ALTER TABLE empresa_contacts ADD COLUMN IF NOT EXISTS company_size_source TEXT DEFAULT 'seed';
      ALTER TABLE empresa_campaign_history ADD COLUMN IF NOT EXISTS sizes_filter TEXT;
      UPDATE empresa_contacts SET company_size = 'unclassified' WHERE company_size IS NULL;
      UPDATE empresa_contacts SET company_size_source = 'seed' WHERE company_size_source IS NULL;
    `);
    log("Empresa tables ensured");
  } catch (err: any) {
    console.error("ensureEmpresasTables error:", err.message);
  }
}

async function ensureEmpresasContacts() {
  try {
    await pool.query(`
      INSERT INTO empresa_contacts (email, company, contact_type) VALUES
      ('empresas@elcorteingles.es',            'El Corte Inglés',   'empresa'),
      ('comunicacionelcorteingles@elcorteingles.es', 'El Corte Inglés', 'empresa'),
      ('clientes@hipercor.es',                 'El Corte Inglés',   'empresa'),
      ('mfraga.re@repsol.com',                 'Repsol',            'empresa'),
      ('uguerra.re@repsol.com',                'Repsol',            'empresa'),
      ('meextremeram.re@repsol.com',           'Repsol',            'empresa'),
      ('nvilloria.re@repsol.com',              'Repsol',            'empresa'),
      ('prensa@repsol.com',                    'Repsol',            'empresa'),
      ('partnerships@telefonica.com',          'Telefónica',        'empresa'),
      ('TefPublicPolicy@telefonica.com',       'Telefónica',        'empresa'),
      ('contacto@fundaciontelefonica.com',     'Telefónica',        'empresa'),
      ('comunica@bbva.com',                    'BBVA',              'empresa'),
      ('prensa@caixabank.com',                 'CaixaBank',         'empresa'),
      ('sostenibilidad@endesa.es',             'Endesa',            'empresa'),
      ('patrocinios@endesa.es',                'Endesa',            'empresa'),
      ('prensa@naturgy.com',                   'Naturgy',           'empresa'),
      ('prensa@acciona.com',                   'Acciona',           'empresa'),
      ('pablo.melero@airbus.com',              'Airbus',            'empresa'),
      ('cristina.garcia-aliste@airbus.com',    'Airbus',            'empresa'),
      ('rocio.caparros@airbus.com',            'Airbus',            'empresa'),
      ('comunicacion@correos.com',             'Correos',           'empresa'),
      ('gabinetedeprensa@aena.es',             'AENA',              'empresa'),
       ('seleccion@aena.es',                    'AENA',              'empresa'),
       ('selecciontitulados@aena.es',           'AENA',              'empresa'),
       ('portalempleo@aena.es',                 'AENA',              'empresa'),
       ('indra@indracompany.com',               'Indra',             'empresa'),
       ('lmahiques@indra.es',                   'Indra',             'empresa'),
      ('carmen_munoz_martin@carrefour.com',    'Carrefour',         'empresa'),
      ('paloma_moreno_reyes@carrefour.com',    'Carrefour',         'empresa'),
      ('alejandro_martin_requena@carrefour.com','Carrefour',        'empresa'),
      ('comunicacionexterna@carrefour.com',    'Carrefour',         'empresa'),
      ('maria.quintin@carrefour.com',          'Carrefour',         'empresa'),
      ('maria.cid@carrefour.com',              'Carrefour',         'empresa'),
      ('comunicacioncorporativa@iberdrola.es', 'Iberdrola',         'empresa'),
      ('carlos.deluis@seat.es',                'SEAT',              'empresa'),
      ('pablo.cofan@seat.es',                  'SEAT',              'empresa'),
      ('investorrelations@moeveglobal.com',    'Moeve Global',      'empresa'),
      ('atencionproveedores@moeveglobal.com',  'Moeve Global',      'empresa'),
      ('suppliers@moeveglobal.com',            'Moeve Global',      'empresa'),
      ('desarrollo.proveedores@moeveglobal.com','Moeve Global',     'empresa'),
      ('medios@moeveglobal.com',               'Moeve Global',      'empresa'),
      ('accionistas@santander.com',            'Santander',         'empresa'),
      ('comunicacion@gruposantander.com',      'Santander',         'empresa'),
      ('web@ferrovial.com',                    'Ferrovial',         'empresa'),
      ('ir@ferrovial.com',                     'Ferrovial',         'empresa'),
      ('press@nvidia.com',                              'NVIDIA',   'empresa'),
      ('industry-analyst-relations@nvidia.com',         'NVIDIA',   'empresa'),
      ('enterprise-pr@nvidia.com',                      'NVIDIA',   'empresa'),
      ('consumer-pr@nvidia.com',                        'NVIDIA',   'empresa'),
      ('embedded-pr@nvidia.com',                        'NVIDIA',   'empresa'),
      ('auto-pr@nvidia.com',                            'NVIDIA',   'empresa'),
      ('emea-pr@nvidia.com',                            'NVIDIA',   'empresa'),
      ('latam-pr@nvidia.com',                           'NVIDIA',   'empresa'),
      ('ir@nvidia.com',                                 'NVIDIA',   'empresa'),
      ('info@nvidia.com',                               'NVIDIA',   'empresa'),
      ('press@walmart.com',                             'Walmart',  'empresa'),
      ('ir@walmart.com',                                'Walmart',  'empresa'),
      ('support@shopify.com',                           'Shopify',  'empresa'),
      ('partners@shopify.com',                          'Shopify',  'empresa'),
      ('billing@shopify.com',                           'Shopify',  'empresa'),
      ('billing-support@shopify.com',                   'Shopify',  'empresa'),
      ('joanne.horibe@magna.com',                       'Magna',    'empresa'),
      ('patricia.figliano@magna.com',                   'Magna',    'empresa'),
      ('invesrel@rbc.com',                              'RBC',      'empresa'),
      ('service@computershare.com',                     'Computershare', 'empresa'),
      ('careers@enbridge.com',                          'Enbridge', 'empresa'),
      ('patrick.murray@enbridge.com',                   'Enbridge', 'empresa'),
      ('heather_norton@apple.com',                      'Apple',    'empresa'),
      ('gbossio@apple.com',                             'Apple',    'empresa'),
      ('media.help@apple.com',                          'Apple',    'empresa'),
      ('media.es@apple.com',                            'Apple',    'empresa'),
      ('smartinprat@apple.com',                         'Apple',       'empresa'),
      ('external.relations@bupa.com',                   'Bupa',        'empresa'),
      ('bupapressoffice@bupa.com',                      'Bupa',        'empresa'),
      ('duncan.west@bupa.com',                          'Bupa',        'empresa'),
      ('ir@bupa.com',                                   'Bupa',        'empresa'),
      ('phyllisia.mccarthy@ee.co.uk',                   'EE',          'empresa'),
      ('alex.buckley@bt.com',                           'BT',          'empresa'),
      ('aleksander.straunik@bt.com',                    'BT',          'empresa'),
      ('jackie.bates@bt.com',                           'BT',          'empresa'),
      ('giles.barron@bt.com',                           'BT',          'empresa'),
      ('roxana.iliescu@bt.com',                         'BT',          'empresa'),
      ('dan.hooper@rolls-royce.com',                    'Rolls-Royce', 'empresa'),
      ('eu.affairs@rolls-royce.com',                    'Rolls-Royce', 'empresa'),
      ('jon.skelson@rolls-royce.com',                   'Rolls-Royce', 'empresa'),
      ('sandra.freeman@rolls-royce.com',                'Rolls-Royce', 'empresa'),
      ('claire.thomas@rolls-royce.com',                 'Rolls-Royce', 'empresa'),
      ('marie.moore@rolls-royce.com',                   'Rolls-Royce', 'empresa'),
      ('heritage.trust@rolls-royce.com',                'Rolls-Royce',   'empresa'),
      ('Press-Office.London@Unilever.com',              'Unilever',      'empresa'),
      ('GroupMedia@vodafone.com',                       'Vodafone',      'empresa'),
      ('ukmediarelations@vodafone.com',                 'Vodafone',      'empresa'),
      ('media@vodafonethree.com',                       'Vodafone',      'empresa'),
      ('UKPressOffice@hsbc.co.uk',                      'HSBC',          'empresa'),
      ('katie.cohen@hsbc.com',                          'HSBC',          'empresa'),
      ('leila.taleb@hsbc.com',                          'HSBC',          'empresa'),
      ('emily.craig@hsbc.com',                          'HSBC',          'empresa'),
      ('robert.cox@hsbc.com',                           'HSBC',          'empresa'),
      ('hannah.langston@hsbc.com',                      'HSBC',          'empresa'),
      ('neil1.fleming@hsbc.com',                        'HSBC',          'empresa'),
      ('pressoffice@hsbc.com',                          'HSBC',          'empresa'),
      ('mediarelationsteam@lloydsbanking.com',          'Lloyds',        'empresa'),
      ('investor.relations@lloydsbanking.com',          'Lloyds',        'empresa'),
      ('debtinvestorrelations@lloydsbanking.com',       'Lloyds',        'empresa'),
      ('careers@lloydsbanking.com',                     'Lloyds',        'empresa'),
      ('James.Abbott@natwest.com',                      'NatWest',       'empresa'),
      ('Claire.French@natwest.com',                     'NatWest',       'empresa'),
      ('Alexandra.Dee@natwest.com',                     'NatWest',       'empresa'),
      ('Seema.Hakim@natwest.com',                       'NatWest',       'empresa'),
      ('Mike.Johnston@natwest.com',                     'NatWest',       'empresa'),
      ('Michelle.slade@natwest.com',                    'NatWest',       'empresa'),
      ('stephanie.melrose@natwest.com',                 'NatWest',       'empresa'),
      ('Jennifer.Russell@natwest.com',                  'NatWest',       'empresa'),
      ('Natasha.virtue@natwest.com',                    'NatWest',       'empresa'),
      ('Jonathan.Rennie@natwest.com',                   'NatWest',       'empresa'),
      ('victoria.whittal-williams@natwest.com',         'NatWest',       'empresa'),
      ('Chelsea.konadu@natwest.com',                    'NatWest',       'empresa'),
      ('David.Nieberg@natwest.com',                     'NatWest',       'empresa'),
      ('elliot.roy@natwest.com',                        'NatWest',       'empresa'),
      ('Jessica.Barker@natwest.com',                    'NatWest',       'empresa'),
      ('eurig.thomas@natwest.com',                      'NatWest',       'empresa'),
      ('corporate.media@gsk.com',                       'GSK',           'empresa'),
      ('es-ci@gsk.com',                                 'GSK',           'empresa'),
      ('Kathleen.x.quinn@gsk.com',                      'GSK',           'empresa'),
      ('Alison.m.hunt@gsk.com',                         'GSK',           'empresa'),
      ('Sydney.a.dodson-nease@gsk.com',                 'GSK',           'empresa'),
      ('Kate.I.kanaby@gsk.com',                         'GSK',           'empresa'),
      ('fiona.murphy-alexander@aviva.com',              'Aviva',         'empresa'),
      ('melissa.loughran@aviva.com',                    'Aviva',         'empresa'),
      ('maddie.simpson@aviva.com',                      'Aviva',         'empresa'),
      ('philippa.terry@aviva.com',                      'Aviva',         'empresa'),
      ('sarah.swailes@aviva.com',                       'Aviva',         'empresa'),
      ('andrew.reid@aviva.com',                         'Aviva',         'empresa'),
      ('ben.moss@aviva.com',                            'Aviva',         'empresa'),
      ('catherine.comben@aviva.com',                    'Aviva',         'empresa'),
      ('sarah.poulter@aviva.com',                       'Aviva',         'empresa'),
      -- French companies
      ('helicia.chalon@axa.fr',                         'AXA',           'empresa'),
      ('antoine.demiere@axa.fr',                        'AXA',           'empresa'),
      ('emploi.handicap@airbus.com',                    'Airbus',        'empresa'),
      ('anne.galabert@airbus.com',                      'Airbus',        'empresa'),
      ('anita.lelievre@veolia.com',                     'Veolia',        'empresa'),
      ('els.bruyneel@engie.com',                        'Engie',         'empresa'),
      ('nathalie.chevrier@orange.com',                  'Orange',        'empresa'),
      ('caroline.cellier@orange.com',                   'Orange',        'empresa'),
      ('ariane.chan@orange.com',                         'Orange',        'empresa'),
      ('mpaule.freitas@orange.com',                     'Orange',        'empresa'),
      ('tom.wright@orange.com',                          'Orange',        'empresa'),
      ('MR@sanofi.com',                                  'Sanofi',        'empresa'),
      ('IR@sanofi.com',                                  'Sanofi',        'empresa'),
      ('epargne-retraite-entreprises@gestion-cardif.fr', 'BNP Cardif',    'empresa'),
      ('Paris.CMCS@BNPParibas.com',                      'BNP Paribas',   'empresa'),
      -- Spanish companies
      ('comunicacionelcorteingles@elcorteingles.es',     'El Corte Inglés',   'empresa'),
      ('coordinador.gestionatc@elcorteingles.es',        'El Corte Inglés',   'empresa'),
      ('atracciondetalento@repsol.com',                  'Repsol',            'empresa'),
      ('informacion@iberdrola.com',                      'Iberdrola',         'empresa'),
      ('comunicacioncorporativa@iberdrola.es',           'Iberdrola',         'empresa'),
       ('jpalaciosl@iberdrola.es',                        'Iberdrola',         'empresa'),
      ('careers@avangrid.com',                           'Avangrid',          'empresa'),
      ('careers@scottishpower.com',                      'ScottishPower',     'empresa'),
      ('comunicacion@gruposantander.com',                'Grupo Santander',   'empresa'),
      ('investor@gruposantander.com',                    'Grupo Santander',   'empresa'),
      ('comunicacion@inditex.com',                       'Inditex',           'empresa'),
      ('r.inversores@inditex.com',                       'Inditex',           'empresa'),
       ('accionistas@inditex.com',                        'Inditex',           'empresa'),
       ('d&i@inditex.com',                                'Inditex',           'empresa'),
       ('seleccion@cellnextelecom.com',                   'Cellnex',           'empresa'),
       ('globaltalentacquisition@cellnextelecom.com',      'Cellnex',           'empresa'),
       ('responsabilidadsocial@mapfre.com',               'Mapfre',            'empresa'),
       ('hr@cieautomotive.com',                            'CIE Automotive',    'empresa'),
      ('ayudaonline@mercadona.es',                       'Mercadona',         'empresa'),
      ('prensatelefonica@telefonica.com',                'Telefónica',        'empresa'),
      ('industryanalysts@telefonica.com',                'Telefónica',        'empresa'),
       ('anamaria.reinosogarcia@telefonica.com',           'Telefónica',        'empresa'),
       ('fondos.sociales@telefonica.com',                  'Telefónica',        'empresa'),
       ('ignacio.murrietasanguino@telefonica.com',         'Telefónica',        'empresa'),
      ('consultasgenerales@bbva.com',                    'BBVA',              'empresa'),
       ('accionistas@bbva.com',                           'BBVA',              'empresa'),
       -- New Spanish corporate contacts
       ('rrhh@rovi.es',                                   'Rovi',             'empresa'),
       ('bd@rovi.es',                                     'Rovi',             'empresa'),
       ('departamento.medico@rovi.es',                    'Rovi',             'empresa'),
       ('qs.investigacion@quironsalud.es',                 'Quirónsalud',      'empresa'),
       ('proyectos.investigac@quironsalud.es',             'Quirónsalud',      'empresa'),
       ('marketing@quironsalud.es',                        'Quirónsalud',      'empresa'),
       ('comunicacioncorporativa@vodafone.com',            'Vodafone',         'empresa'),
       ('jaime.andres@vodafone.com',                       'Vodafone',         'empresa'),
       ('adolfo.miranda@vodafone.com',                     'Vodafone',         'empresa'),
       ('ofertaempleados@vodafone.com',                    'Vodafone',         'empresa'),
       ('beatriz.guerra@vodafone.com',                     'Vodafone',         'empresa'),
       ('cinfa@cinfa.com',                                 'Cinfa',            'empresa'),
       ('sac@cinfa.com',                                   'Cinfa',            'empresa'),
       ('medicaldispenser.sac@cinfa.com',                  'Cinfa',            'empresa'),
       ('lavozdelpaciente@cinfa.com',                      'Cinfa',            'empresa'),
       ('raise@capgemini.com',                             'Capgemini',        'empresa'),
       ('nicolas.bertet@capgemini.com',                    'Capgemini',        'empresa'),
       ('luismiguel.marinaparicio@capgemini.com',          'Capgemini',        'empresa'),
       ('borja.tinao@capgemini.com',                       'Capgemini',        'empresa'),
       ('david.luengo-ruiz@capgemini.com',                 'Capgemini',        'empresa'),
       ('cesar.tauste-martinez@capgemini.com',             'Capgemini',        'empresa'),
       ('damien.halle@capgemini.com',                      'Capgemini',        'empresa'),
       ('ignacio.grandes-nunez@capgemini.com',             'Capgemini',        'empresa'),
       ('Ethics@capgemini.com',                            'Capgemini',        'empresa'),
       ('brad.pick@grifols.com',                           'Grifols',          'empresa'),
       ('inversores@grifols.com',                          'Grifols',          'empresa'),
       ('investors@grifols.com',                           'Grifols',          'empresa'),
       ('media@grifols.com',                               'Grifols',          'empresa'),
       ('ignacio.jabato@cuatrecasas.com',                  'Cuatrecasas',      'empresa'),
       ('ruben.doctor@cuatrecasas.com',                    'Cuatrecasas',      'empresa'),
       ('franciscoramon.lacomba@cuatrecasas.com',           'Cuatrecasas',      'empresa'),
       ('fundacionsh@sanitas.es',                          'Sanitas',          'empresa'),
       ('recursoshumanos@crimidesa.es',                    'Crimidesa',        'empresa'),
       ('info.impulsa@impulsaxp.com',                      'Impulsa XP',       'empresa'),
       ('hola@cyria360.com',                               'Cyria360',         'empresa'),
       ('comercial@grado3.com',                            'Grado3',           'empresa'),
       ('hola@habilitips.com',                             'Habilitips',       'empresa'),
       ('info@grupoconstant.com',                          'Grupo Constant',   'empresa'),
       ('info@etalentum.com',                              'eTalentum',        'empresa'),
       ('info@valora2021.com',                             'Valora 2021',      'empresa'),
       ('info@enevolucion.com',                            'En Evolución',     'empresa'),
       ('info@alex.es',                                    'Alex',             'empresa'),
       ('fluidralab@fluidra.com',                          'Fluidra',           'empresa'),
       ('esg@fluidra.com',                                 'Fluidra',           'empresa'),
       ('corporate.communication@almirall.com',             'Almirall',          'empresa'),
       ('international.valenciaconsuelo@vithas.es',         'Vithas',            'empresa'),
       ('NavalonE@vithas.es',                               'Vithas',            'empresa'),
       ('International.Madrid@Vithas.es',                  'Vithas',            'empresa'),
       ('international.madridPA@Vithas.es',                 'Vithas',            'empresa'),
       ('international.milagrosa@vithas.es',                'Vithas',            'empresa'),
       ('ventas1.bcn@barcelo.com',                          'Barceló',           'empresa'),
       ('malaga.comercial@barcelo.com',                    'Barceló',           'empresa'),
       ('canfrancestacion.comercial@barcelo.com',           'Barceló',           'empresa'),
       ('rrhh@imqprevencion.es',                            'IMQ Prevención',    'empresa'),
       ('rrhh@agui.com',                                    'AGUI',              'empresa'),
       ('rrhh@grupoalava.com',                              'Grupo Álava',       'empresa'),
       ('rrhh@campo-ochandiano.com',                        'Campo & Ochandiano','empresa'),
       ('ibonolazabal@walt.es',                             'Walt HR Evolus',    'empresa')
      ON CONFLICT (email) DO NOTHING
    `);
    // Mark international EN·FR contacts
    await pool.query(`
      UPDATE empresa_contacts SET language = 'en_fr'
      WHERE company IN ('NVIDIA', 'Walmart', 'Shopify', 'Magna', 'RBC', 'Computershare', 'Enbridge', 'Apple', 'Bupa', 'EE', 'BT', 'Rolls-Royce', 'Unilever', 'Vodafone', 'HSBC', 'Lloyds', 'NatWest', 'GSK', 'Aviva')
        AND (language IS NULL OR language != 'en_fr')
    `);
    // Mark French companies as FR
    await pool.query(`
      UPDATE empresa_contacts SET language = 'fr'
      WHERE company IN ('AXA', 'Airbus', 'Veolia', 'Engie', 'Orange', 'Sanofi', 'BNP Cardif', 'BNP Paribas')
        AND (language IS NULL OR language != 'fr')
    `);
    // Mark Spanish companies as ES
    await pool.query(`
      UPDATE empresa_contacts SET language = 'es'
      WHERE company IN ('El Corte Inglés', 'Repsol', 'Iberdrola', 'Avangrid', 'ScottishPower', 'Grupo Santander', 'Inditex', 'Cellnex', 'Mapfre', 'CIE Automotive', 'AENA', 'Indra', 'Mercadona', 'Telefónica', 'BBVA', 'Rovi', 'Quirónsalud', 'Cinfa', 'Capgemini', 'Grifols', 'Cuatrecasas', 'Sanitas', 'Crimidesa', 'Impulsa XP', 'Cyria360', 'Grado3', 'Habilitips', 'Grupo Constant', 'eTalentum', 'Valora 2021', 'En Evolución', 'Alex', 'Fluidra', 'Almirall', 'Vithas', 'Barceló', 'IMQ Prevención', 'AGUI', 'Grupo Álava', 'Campo & Ochandiano', 'Walt HR Evolus')
        AND (language IS NULL OR language != 'es')
    `);
    // Clasificación aportada para la prospección corporativa. Se mantiene
    // separada de los planes de NUXA: representa el tamaño de la organización.
    await pool.query(`
      UPDATE empresa_contacts SET
        company_size = CASE
        WHEN company IN ('Santander', 'Grupo Santander', 'Carrefour', 'Capgemini') THEN '200k_plus'
        WHEN company IN ('Inditex', 'Mercadona', 'BBVA', 'Telefónica') THEN '100k_199999'
        WHEN company IN ('Iberdrola', 'CaixaBank', 'Lidl', 'El Corte Inglés', 'Mapfre', 'ACS', 'Endesa', 'Naturgy', 'Correos') THEN '50k_99999'
        WHEN company IN ('Gestamp', 'Grifols', 'Ferrovial', 'Amadeus') THEN '20k_49999'
        WHEN company IN ('Sacyr', 'Aena', 'AENA', 'Renfe', 'Iberia', 'SEAT', 'SEAT/CUPRA', 'Indra', 'Meliá Hotels', 'Vodafone España', 'Vodafone', 'Quirónsalud', 'Sanitas') THEN '5k_19999'
        WHEN company IN ('ROVI', 'Rovi', 'Cinfa', 'Cuatrecasas') THEN '2k_4999'
        WHEN company IN ('CIE Automotive') THEN 'pending'
        WHEN company IN ('Fluidra', 'Almirall', 'Vithas', 'Barceló', 'IMQ Prevención', 'AGUI', 'Grupo Álava', 'Campo & Ochandiano', 'Walt HR Evolus') THEN 'under_5k'
        WHEN company IN ('Crimidesa', 'Impulsa XP', 'CYRIA', 'Cyria360', 'Grado 3', 'Grado3', 'Habilitips', 'Grupo Constant', 'Etalentum', 'eTalentum', 'Valora', 'Valora 2021', 'enEvolución', 'En Evolución', 'Ruedas Alex', 'Alex', 'Affor Health', 'ICF', 'CIMALSA', 'FGC', 'TIC Salut Social', 'i2CAT', 'AOC', 'IDI', 'SEM', 'CAR', 'Servei Meteorològic de Catalunya', 'Ifercat', 'Agència de l''Aigua', 'Agència de Residus', 'INCASÒL', 'CIRE', 'Agència Catalana de la Joventut') THEN 'under_2k'
        ELSE COALESCE(company_size, 'unclassified')
        END,
        company_size_source = 'seed'
      WHERE contact_type = 'empresa'
        AND company_size_source = 'seed'
    `);
    log("Empresa contacts seeded");
  } catch (err: any) {
    console.error("ensureEmpresasContacts error:", err.message);
  }
}

async function ensureEmpresaTemplates() {
  try {
    const appleSubject = `NUXA.LIFE — An idea Steve Jobs would have understood / Une idée que Steve Jobs aurait comprise`;
    const appleBody = `To Apple and the Apple team,

I am writing to you from Spain to introduce NUXA.LIFE, a digital emotional-support platform built around a simple idea:

Technology can be much closer to people when they need it most.

I am convinced that Steve Jobs would have immediately understood the concept behind NUXA.

Jobs did not see technology simply as devices. He saw it as a way to transform the relationship between people and technology, making products useful, accessible, intuitive and beautifully simple.

That is precisely where NUXA begins.

NUXA is a digital platform providing 24/7 emotional support, guidance and mental-health resources, accessible from a smartphone, tablet or computer. It is designed to complement—not replace—psychologists and healthcare professionals.

But there is something more important.

NUXA should not remain just another application.

It could become an emotional-support layer integrated into the digital ecosystem people already use every day: smartphones, computers, tablets and other connected devices.

That is where I believe Apple could understand the potential of NUXA better than almost anyone else.

I am not writing simply to present another app.

I am writing to ask a bigger question:

What if technology could not only connect people, inform them and entertain them, but also provide immediate emotional support when they need it?

Technology already knows how to communicate with us.

Perhaps the next step is for technology to learn how to accompany us.

NUXA is already available:
🌐 https://nuxa.life/

It can be tested and experienced directly.

If Steve Jobs were designing the next chapter in the relationship between people and technology today, I sincerely believe that an idea like NUXA would deserve a place on the table.

That is why I decided to write to you.

NUXA.LIFE
Technology that stays close to people.

────────────────────────────────────────

À Apple et à l'équipe Apple,

Je vous écris depuis l'Espagne pour vous présenter NUXA.LIFE, une plateforme numérique de soutien émotionnel construite autour d'une idée simple :

La technologie peut être bien plus proche des personnes lorsqu'elles en ont le plus besoin.

Je suis convaincu que Steve Jobs aurait immédiatement compris le concept derrière NUXA.

Jobs ne voyait pas la technologie simplement comme des appareils. Il la voyait comme un moyen de transformer la relation entre les personnes et la technologie, en rendant les produits utiles, accessibles, intuitifs et d'une simplicité élégante.

C'est précisément là que NUXA commence.

NUXA est une plateforme numérique offrant un soutien émotionnel, des conseils et des ressources en santé mentale disponibles 24h/24 et 7j/7, accessibles depuis un smartphone, une tablette ou un ordinateur. Elle est conçue pour compléter — et non remplacer — les psychologues et les professionnels de santé.

Mais il y a quelque chose de plus important.

NUXA ne devrait pas rester simplement une application parmi d'autres.

Elle pourrait devenir une couche de soutien émotionnel intégrée dans l'écosystème numérique que les personnes utilisent déjà chaque jour : smartphones, ordinateurs, tablettes et autres appareils connectés.

C'est là que je crois qu'Apple pourrait comprendre le potentiel de NUXA mieux que presque n'importe qui d'autre.

Je n'écris pas simplement pour présenter une nouvelle application.

J'écris pour poser une question plus grande :

Et si la technologie pouvait non seulement connecter les personnes, les informer et les divertir, mais aussi leur offrir un soutien émotionnel immédiat lorsqu'elles en ont besoin ?

La technologie sait déjà comment communiquer avec nous.

La prochaine étape serait peut-être que la technologie apprenne à nous accompagner.

NUXA est déjà disponible :
🌐 https://nuxa.life/

Elle peut être testée et expérimentée directement.

Si Steve Jobs concevait aujourd'hui le prochain chapitre de la relation entre les personnes et la technologie, je crois sincèrement qu'une idée comme NUXA mériterait une place à la table.

C'est pourquoi j'ai décidé de vous écrire.

NUXA.LIFE
La technologie qui reste proche des personnes.`;

    await pool.query(`
      INSERT INTO empresa_email_templates (name, subject, body)
      SELECT $1, $2, $3
      WHERE NOT EXISTS (SELECT 1 FROM empresa_email_templates WHERE name = $1)
    `, ["🍎 Apple — NUXA.LIFE (EN·FR)", appleSubject, appleBody]);

    const intlSubject = `NUXA.LIFE — Emotional wellbeing for your organisation / Bien-être émotionnel pour votre organisation`;
    const intlBody = `Dear team,

We are writing to you from Spain to introduce NUXA.LIFE, a professional digital platform for emotional support and mental wellbeing.

NUXA provides organisations with:
• 24/7 emotional support and mental-health guidance for every employee
• Reduction of absenteeism caused by stress, anxiety and burnout
• Compliance with ISO 45003 psychosocial risk management standards
• Aggregated, anonymised reports for HR teams

We believe NUXA could make a real difference for your people.

We would welcome the opportunity to arrange a brief 20-minute call to explore how NUXA could fit into your wellbeing strategy.

NUXA is already available and can be experienced directly:
🌐 https://nuxa.life/

We remain at your disposal.

The NUXA Team
https://nuxa.life/

────────────────────────────────────────

Chère équipe,

Nous vous écrivons depuis l'Espagne pour vous présenter NUXA.LIFE, une plateforme numérique professionnelle de soutien émotionnel et de bien-être mental.

NUXA offre aux organisations :
• Un soutien émotionnel et des ressources en santé mentale disponibles 24h/24 et 7j/7 pour chaque collaborateur
• Une réduction de l'absentéisme causé par le stress, l'anxiété et le burnout
• La conformité à la norme ISO 45003 de gestion des risques psychosociaux
• Des rapports agrégés et anonymisés pour les équipes RH

Nous pensons que NUXA pourrait faire une vraie différence pour vos équipes.

Nous serions ravis de convenir d'un bref appel de 20 minutes pour explorer comment NUXA pourrait s'intégrer dans votre stratégie de bien-être.

NUXA est déjà disponible et peut être expérimentée directement :
🌐 https://nuxa.life/

Nous restons à votre disposition.

L'équipe NUXA
https://nuxa.life/`;

    await pool.query(`
      INSERT INTO empresa_email_templates (name, subject, body)
      SELECT $1, $2, $3
      WHERE NOT EXISTS (SELECT 1 FROM empresa_email_templates WHERE name = $1)
    `, ["🌍 Internacional — Presentación NUXA (EN·FR)", intlSubject, intlBody]);

    log("Empresa templates seeded");
  } catch (err: any) {
    console.error("ensureEmpresaTemplates error:", err.message);
  }
}

async function ensureInstitutionTemplates() {
  try {
    const catSubject = `NUXA.life — Nota Informativa: Plataforma de suport emocional digital per a la ciutadania`;
    const catBody = `<div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#222;line-height:1.6;">
  <h1 style="text-align:center;font-size:22px;margin-bottom:4px;">Departament de Salut – Nota Informativa</h1>
  <h2 style="font-size:16px;font-weight:normal;text-align:center;margin-top:4px;margin-bottom:24px;color:#444;">Presentació de la Plataforma NUXA.life</h2>

  <p>El Departament de Salut informa de la posada en marxa de <strong>NUXA.life</strong>, una eina digital innovadora orientada a la promoció de la salut mental i el benestar emocional de la ciutadania.</p>

  <h3 style="margin-top:24px;"><em>Què és NUXA.life?</em></h3>
  <p>NUXA.life és una plataforma digital de suport emocional disponible les 24 hores del dia, els 7 dies de la setmana. Ofereix acompanyament personalitzat a través d'un xat intel·ligent adaptat a diferents perfils d'usuari: adolescents, adults, famílies i entorns empresarials. La plataforma complementa, sense substituir, la tasca dels professionals de la salut mental.</p>

  <h3 style="margin-top:24px;"><em>Com funciona?</em></h3>
  <p>
    – <strong>Xat interactiu:</strong> l'usuari pot dialogar amb un assistent especialitzat que adapta el seu llenguatge i respostes segons el perfil seleccionat (adolescent, adult, família o empresa).<br><br>
    – <strong>Recursos psicoeducatius:</strong> la plataforma ofereix pautes concretes de regulació emocional, estratègies d'estudi, eines per a la gestió de l'estrès i orientació per a la presa de decisions.<br><br>
    – <strong>Accés flexible:</strong> disponible en línia, 24 hores al dia, amb subscripció mensual reduïda (2,99 €) per garantir l'accessibilitat a tota la població.<br><br>
    – <strong>Confidencialitat i seguretat:</strong> totes les interaccions són privades i respecten els estàndards de protecció de dades i ètica professional.
  </p>

  <h3 style="margin-top:24px;"><em>Beneficis per a la ciutadania</em></h3>
  <p>
    1. <strong>Prevenció:</strong> ajuda a detectar i gestionar de forma primerenca situacions d'estrès, ansietat, baixa autoestima o conflictes escolars/familiars.<br>
    2. <strong>Accessibilitat:</strong> garanteix suport immediat a persones que no poden accedir fàcilment a serveis presencials.<br>
    3. <strong>Complementarietat:</strong> no substitueix la tasca dels professionals de la salut mental, sinó que actua com a recurs complementari i d'acompanyament.<br>
    4. <strong>Promoció del benestar:</strong> fomenta hàbits saludables, autoconeixement i resiliència, especialment en la població jove.<br>
    5. <strong>Impacte social:</strong> NUXA.life és també una eina pensada per a entorns laborals i escolars, contribuint a millorar el clima emocional i prevenir l'estrès crònic.
  </p>

  <h3 style="margin-top:24px;"><em>Compromís amb la salut pública</em></h3>
  <p>Amb NUXA.life, el Departament de Salut reafirma el seu compromís amb la innovació digital en salut mental i la necessitat d'oferir solucions properes, accessibles i adaptades a les noves realitats socials.</p>

  <p style="margin-top:28px;color:#555;">🌐 <a href="https://nuxa.life" style="color:#00897b;">https://nuxa.life</a></p>
</div>`;

    await pool.query(`
      INSERT INTO institution_email_templates (name, subject, body)
      SELECT $1, $2, $3
      WHERE NOT EXISTS (SELECT 1 FROM institution_email_templates WHERE name = $1)
    `, ["🏥 Catalunya — Nota Informativa NUXA.life (CA)", catSubject, catBody]);

    log("Institution templates seeded");
  } catch (err: any) {
    console.error("ensureInstitutionTemplates error:", err.message);
  }
}

async function ensureMutuaTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mutua_contacts (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        region TEXT,
        opted_out BOOLEAN DEFAULT false,
        opted_out_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        contact_type TEXT DEFAULT 'mutua'
      );
      CREATE TABLE IF NOT EXISTS mutua_campaign_history (
        id SERIAL PRIMARY KEY,
        sent_at TIMESTAMPTZ DEFAULT NOW(),
        subject TEXT NOT NULL,
        sent_count INT DEFAULT 0,
        failed_count INT DEFAULT 0,
        opens INT DEFAULT 0,
        regions_filter TEXT,
        scheduled_at TIMESTAMPTZ,
        status TEXT DEFAULT 'sent',
        subject_b TEXT,
        body TEXT
      );
      CREATE TABLE IF NOT EXISTS mutua_email_tracking (
        id SERIAL PRIMARY KEY,
        campaign_id INT REFERENCES mutua_campaign_history(id) ON DELETE CASCADE,
        contact_email TEXT NOT NULL,
        resend_message_id TEXT,
        opened_at TIMESTAMPTZ,
        subject_variant TEXT DEFAULT 'a'
      );
      CREATE TABLE IF NOT EXISTS mutua_email_templates (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    log("Mutua tables ensured");
  } catch (err: any) {
    console.error("ensureMutuaTables error:", err.message);
  }
}

async function ensureMutuaContacts() {
  try {
    await pool.query(`
      INSERT INTO mutua_contacts (email, name, region, contact_type) VALUES
      ('asepeyo@asepeyo.es',               '', 'Asepeyo',               'mutua'),
      ('colaboradores@asepeyo.es',          '', 'Asepeyo',               'mutua'),
      ('prensa@asepeyo.es',                 '', 'Asepeyo',               'mutua'),
      ('atencionalcliente@ibermutua.es',    '', 'Ibermutua',             'mutua'),
      ('emutua@fraternidad.com',            '', 'Fraternidad-Muprespa',  'mutua'),
      ('info@mutuauniversal.net',           '', 'Mutua Universal',       'mutua'),
      ('w.ivern@mutuabalear.es',            '', 'Mutua Balear',          'mutua'),
      ('pamengual@mutuabalear.es',          '', 'Mutua Balear',          'mutua'),
      ('pfonolla@mutuabalear.es',           '', 'Mutua Balear',          'mutua'),
      ('comunicacion@mutuanavarra.es',      '', 'Mutua Navarra',         'mutua'),
      ('mutualista@mutua-intercomarcal.com','', 'Mutua Intercomarcal',   'mutua')
      ON CONFLICT (email) DO NOTHING
    `);
    log("Mutua contacts seeded");
  } catch (err: any) {
    console.error("ensureMutuaContacts error:", err.message);
  }
}

async function ensureInstitutionTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS institution_campaign_history (
        id SERIAL PRIMARY KEY,
        sent_at TIMESTAMPTZ DEFAULT NOW(),
        subject TEXT NOT NULL,
        sent_count INT DEFAULT 0,
        failed_count INT DEFAULT 0,
        opens INT DEFAULT 0,
        regions_filter TEXT,
        scheduled_at TIMESTAMPTZ,
        status TEXT DEFAULT 'sent',
        subject_b TEXT,
        body TEXT
      );
      CREATE TABLE IF NOT EXISTS institution_email_tracking (
        id SERIAL PRIMARY KEY,
        campaign_id INT REFERENCES institution_campaign_history(id) ON DELETE CASCADE,
        contact_email TEXT NOT NULL,
        resend_message_id TEXT,
        opened_at TIMESTAMPTZ,
        subject_variant TEXT DEFAULT 'a'
      );
      CREATE TABLE IF NOT EXISTS institution_email_templates (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    // Add columns to existing tables if missing (idempotent)
    await pool.query(`
      ALTER TABLE institution_contacts ADD COLUMN IF NOT EXISTS contact_type TEXT;
      ALTER TABLE institution_campaign_history ADD COLUMN IF NOT EXISTS regions_filter TEXT;
      ALTER TABLE institution_campaign_history ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;
      ALTER TABLE institution_campaign_history ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'sent';
      ALTER TABLE institution_campaign_history ADD COLUMN IF NOT EXISTS subject_b TEXT;
      ALTER TABLE institution_campaign_history ADD COLUMN IF NOT EXISTS body TEXT;
      ALTER TABLE institution_email_tracking ADD COLUMN IF NOT EXISTS subject_variant TEXT DEFAULT 'a';
    `);
    // Seed retroactive campaign entry if history is empty
    await pool.query(`
      INSERT INTO institution_campaign_history (sent_at, subject, sent_count, failed_count, opens, status)
      SELECT '2026-08-12 13:34:00+00', 'NUXA — Apoyo emocional profesional para sus equipos de salud', 55, 0, 0, 'sent'
      WHERE NOT EXISTS (SELECT 1 FROM institution_campaign_history)
    `);
    log("Institution tables ensured");
  } catch (err: any) {
    console.error("ensureInstitutionTables error:", err.message);
  }
}

async function ensureInstitutionContacts() {
  try {
    await pool.query(`
      INSERT INTO institution_contacts (email, region) VALUES
      ('alertas.productossanitarios@larioja.org','La Rioja'),
      ('asistencia.transfronteriza@sespa.princast.es','Asturias'),
      ('asistenciatransfronteriza@listas.carm.es','Murcia'),
      ('astransfronteriza@salud-juntaex.es','Extremadura'),
      ('atencioalciutada@catsalut.cat','Cataluña'),
      ('atencionusuario@cantabria.es','Cantabria'),
      ('atencionusuarios@sescam.jccm.es','Castilla-La Mancha'),
      ('atenciousuari@ibsalut.es','Baleares'),
      ('ayudadigital.sspa@juntadeandalucia.es','Andalucía'),
      ('buzgen.dg@scsalud.es','Cantabria'),
      ('buzgen.dt.ceuta@ingesa.sanidad.gob.es','Ceuta'),
      ('cluster@innovacionsanitaria.com','Nacional'),
      ('consejosalud@navarra.es','Navarra'),
      ('deteprec@navarra.es','Navarra'),
      ('dgerencia@salud.aragon.es','Aragón'),
      ('direcciongeneralsalud@navarra.es','Navarra'),
      ('direcciongerencia.ses@salud-juntaex.es','Extremadura'),
      ('dpd.cpidssa@juntadeandalucia.es','Andalucía'),
      ('dpd@ibsalut.es','Baleares'),
      ('dpd@ticsalutsocial.cat','Cataluña'),
      ('fomento.innovacion@navarra.es','Navarra'),
      ('gabinete.salud@navarra.es','Navarra'),
      ('gerensns@navarra.es','Navarra'),
      ('iau@riojasalud.es','La Rioja'),
      ('info@clustersaude.com','Galicia'),
      ('informacion.sector2@salud.aragon.es','Aragón'),
      ('innovacion.acis@sergas.es','Galicia'),
      ('innovacion.chuac@sergas.es','Galicia'),
      ('innovacion.iacs@aragon.es','Aragón'),
      ('investigacion.salud@navarra.es','Navarra'),
      ('investinnova.sanidad@jcyl.es','Castilla y León'),
      ('isp.promocion@navarra.es','Navarra'),
      ('ispdirec@navarra.es','Navarra'),
      ('ispepidem@navarra.es','Navarra'),
      ('ispwebge@navarra.es','Navarra'),
      ('ocatt@catsalut.cat','Cataluña'),
      ('oddus.cs@gobiernodecanarias.org','Canarias'),
      ('otri.iacs@aragon.es','Aragón'),
      ('plan.docente.salud@navarra.es','Navarra'),
      ('prestaciones.dt.melilla@ingesa.sanidad.gob.es','Melilla'),
      ('programa.ulceras.fora@sergas.es','Galicia'),
      ('protecciondatos.iacs@aragon.es','Aragón'),
      ('sacylinnova@jcyl.es','Castilla y León'),
      ('salud.responde@navarra.es','Navarra'),
      ('saludresponde@juntadeandalucia.es','Andalucía'),
      ('sanidadinforma@salud.madrid.org','Madrid'),
      ('sanidadtransfronterizacv@gva.es','Comunidad Valenciana'),
      ('sapu.emergentziak@osakidetza.eus','País Vasco'),
      ('sau.tic@gencat.cat','Cataluña'),
      ('secretaria.consejero.salud@navarra.es','Navarra'),
      ('sg.scs@gobiernodecanarias.org','Canarias'),
      ('soportec@navarra.es','Navarra'),
      ('sugerencias.emergentziak@osakidetza.eus','País Vasco'),
      ('sxs.planificacion.sanitaria@sergas.es','Galicia'),
      ('usuariosaragonsalud@aragon.es','Aragón'),
      -- Catalunya
      ('direcciogerencia@gencat.cat','Cataluña'),
      ('osir.ics@gencat.cat','Cataluña'),
      ('premsa.ics@gencat.cat','Cataluña'),
      ('dirgerencia@vallhebron.cat','Cataluña'),
      ('comunicacio@vhebron.net','Cataluña'),
      ('comunicacio.germanstrias@gencat.cat','Cataluña'),
      ('germanstrias@gencat.cat','Cataluña'),
      ('comunicacio.bellvitge@bellvitgehospital.cat','Cataluña'),
      ('premsa.girona.ics@gencat.cat','Cataluña'),
      ('docenciahtrueta.girona.ics@gencat.cat','Cataluña'),
      ('comunicacio.lleida.ics@gencat.cat','Cataluña'),
      ('docenciafsehuav.lleida.ics@gencat.cat','Cataluña'),
      ('comunicacioicstgn@gencat.cat','Cataluña'),
      ('mir.hj23.ics@gencat.cat','Cataluña'),
      ('serveidecomunicacio.ebre.ics@gencat.cat','Cataluña'),
      ('docenciahtvc.ebre.ics@gencat.cat','Cataluña'),
      ('innovacio@clinic.cat','Cataluña'),
      ('premsa@clinic.cat','Cataluña'),
      ('docencia@clinic.cat','Cataluña'),
      ('uaciutadania@clinic.cat','Cataluña'),
      ('salutibenestar@tauli.cat','Cataluña'),
      ('projectesi3pt@tauli.cat','Cataluña'),
      ('ariu@tauli.cat','Cataluña'),
      ('rsales@tauli.cat','Cataluña'),
      ('emcabello@tauli.cat','Cataluña'),
      ('rsanz@tauli.cat','Cataluña'),
      ('rmontoro@tauli.cat','Cataluña'),
      ('comunicacio@tauli.cat','Cataluña'),
      ('admissions@guttmann.com','Cataluña'),
      ('barcelona@guttmann.com','Cataluña'),
      ('bbhi@guttmann.com','Cataluña'),
      ('calvarez@ticsalutsocial.cat','Cataluña'),
      ('gestio.recerca.idi@gencat.cat','Cataluña'),
      ('innovacio@aoc.cat','Cataluña'),
      ('josep.martrat@i2cat.net','Cataluña'),
      ('arnau.sala@i2cat.net','Cataluña'),
      ('secretaria@ticsalutsocial.cat','Cataluña'),
      ('comunicacio@ticsalutsocial.cat','Cataluña'),
      ('info@ticsalutsocial.cat','Cataluña'),
      ('gerencia.idi@gencat.cat','Cataluña'),
      ('dinamitzacio@aoc.cat','Cataluña'),
      ('jim.ahtes@i2cat.net','Cataluña'),
      ('manel.medina@i2cat.net','Cataluña'),
      ('marc.guerrero@i2cat.net','Cataluña'),
      ('alex.romaguera@i2cat.net','Cataluña'),
      ('ignasi.oliva@i2cat.net','Cataluña'),
       ('fundacio@i2cat.net','Cataluña'),
       ('fgcconvocatoria@fgc.cat','Cataluña'),
       ('info@icf.cat','Cataluña'),
       ('cimalsa@cimalsa.cat','Cataluña'),
       ('ports.generalitat@gencat.cat','Cataluña'),
       ('aula.consum@gencat.cat','Cataluña'),
       ('accformacio@gencat.cat','Cataluña'),
       ('direccio.sem@gencat.cat','Cataluña'),
       ('rrhh.sem@gencat.cat','Cataluña'),
       ('formacio.sem@gencat.cat','Cataluña'),
       ('comunicacio.sem@gencat.cat','Cataluña'),
       ('psicoleg.sem@gencat.cat','Cataluña'),
       ('andrescuartero@gencat.cat','Cataluña'),
       ('ico@iconcologia.net','Cataluña'),
       ('uicico@iconcologia.net','Cataluña'),
       ('lmillares@iconcologia.net','Cataluña'),
       ('mireiaramon@iconcologia.net','Cataluña'),
       ('regulatorio_icobad@iconcologia.net','Cataluña'),
       ('aca@gencat.cat','Cataluña'),
       ('acaparticipacio@gencat.cat','Cataluña')
      ON CONFLICT (email) DO NOTHING
    `);
    // Subcarpetes Catalunya per naturalesa
    await pool.query(`
      UPDATE institution_contacts SET contact_type = 'CAT · ICS / Xarxa Pública'
      WHERE region = 'Cataluña' AND email SIMILAR TO '%(\.ics@gencat\.cat|@gencat\.cat)%'
        AND email NOT IN ('direcciogerencia@gencat.cat','gestio.recerca.idi@gencat.cat','gerencia.idi@gencat.cat',
                          'comunicacio.germanstrias@gencat.cat','germanstrias@gencat.cat')
        AND (contact_type IS NULL OR contact_type NOT LIKE 'CAT ·%')
    `);
    await pool.query(`
      UPDATE institution_contacts SET contact_type = 'CAT · Hospitals i Centres'
      WHERE region = 'Cataluña' AND email SIMILAR TO '%(vallhebron\.cat|vhebron\.net|bellvitgehospital\.cat|clinic\.cat|tauli\.cat|guttmann\.com|germanstrias)%'
        AND (contact_type IS NULL OR contact_type NOT LIKE 'CAT ·%')
    `);
    await pool.query(`
      UPDATE institution_contacts SET contact_type = 'CAT · Tecnologia i Innovació'
      WHERE region = 'Cataluña' AND email SIMILAR TO '%(ticsalutsocial\.cat|@aoc\.cat|@i2cat\.net)%'
        AND (contact_type IS NULL OR contact_type NOT LIKE 'CAT ·%')
    `);
    await pool.query(`
      UPDATE institution_contacts SET contact_type = 'CAT · Generalitat / CatSalut'
      WHERE region = 'Cataluña'
        AND email IN ('direcciogerencia@gencat.cat','gestio.recerca.idi@gencat.cat','gerencia.idi@gencat.cat',
                      'atencioalciutada@catsalut.cat','ocatt@catsalut.cat','dpd@ticsalutsocial.cat','sau.tic@gencat.cat')
        AND (contact_type IS NULL OR contact_type NOT LIKE 'CAT ·%')
    `);
    await pool.query(`
      UPDATE institution_contacts SET contact_type = 'CAT · Mobilitat i Infraestructures'
      WHERE region = 'Cataluña'
        AND email IN ('fgcconvocatoria@fgc.cat','cimalsa@cimalsa.cat','ports.generalitat@gencat.cat')
    `);
    await pool.query(`
      UPDATE institution_contacts SET contact_type = 'CAT · Finances Públiques'
      WHERE region = 'Cataluña' AND email = 'info@icf.cat'
    `);
    await pool.query(`
      UPDATE institution_contacts SET contact_type = 'CAT · Consum i Formació'
      WHERE region = 'Cataluña'
        AND email IN ('aula.consum@gencat.cat','accformacio@gencat.cat')
    `);
    await pool.query(`
      UPDATE institution_contacts SET contact_type = 'CAT · Emergències i Salut'
      WHERE region = 'Cataluña'
        AND email IN ('direccio.sem@gencat.cat','rrhh.sem@gencat.cat','formacio.sem@gencat.cat',
                     'comunicacio.sem@gencat.cat','psicoleg.sem@gencat.cat')
    `);
    await pool.query(`
      UPDATE institution_contacts SET contact_type = 'CAT · Oncologia i Hospitals'
      WHERE region = 'Cataluña'
        AND email IN ('ico@iconcologia.net','uicico@iconcologia.net','lmillares@iconcologia.net',
                     'mireiaramon@iconcologia.net','regulatorio_icobad@iconcologia.net')
    `);
    await pool.query(`
      UPDATE institution_contacts SET contact_type = 'CAT · Medi Ambient i Aigua'
      WHERE region = 'Cataluña'
        AND email IN ('aca@gencat.cat','acaparticipacio@gencat.cat')
    `);
    await pool.query(`
      UPDATE institution_contacts SET contact_type = 'CAT · Generalitat / Xarxa Pública'
      WHERE region = 'Cataluña' AND email = 'andrescuartero@gencat.cat'
    `);
    log("Institution contacts seeded");
  } catch (err: any) {
    console.error("ensureInstitutionContacts error:", err.message);
  }
}

// Prevent transient DB/network errors from crashing the process
process.on("uncaughtException", (err: Error) => {
  console.error("[process] Uncaught exception (kept alive):", err.message);
});
process.on("unhandledRejection", (reason: unknown) => {
  console.error("[process] Unhandled rejection (kept alive):", reason);
});

const app = express();

// Apply express.json() conditionally - exclude Stripe webhook route
app.use((req, res, next) => {
  if (req.path === "/api/stripe/webhook") {
    // Skip JSON parsing for Stripe webhook - it needs raw body
    return next();
  }
  express.json()(req, res, next);
});

app.use(express.urlencoded({ extended: false }));

// Create memory store for sessions
const memoryStore = MemoryStore(session);

// Session configuration for user authentication
app.use(session({
  secret: "nflow-admin-secret-2025",
  store: new memoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: false, // Allow frontend access
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // Allow same-site requests
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await ensureAdminUser();
  await ensureInstitutionTables();
  await ensureInstitutionContacts();
  await ensureInstitutionTemplates();
  await ensureMutuaTables();
  await ensureMutuaContacts();
  await ensureEmpresasTables();
  await ensureEmpresasContacts();
  await ensureEmpresaTemplates();
  await ensureLeadTables();
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  const isProd = app.get("env") !== "development";

  // SEO middleware: inject route-specific meta for bots/crawlers
  // Must run BEFORE Vite/static middleware to intercept crawler requests
  registerSeoMiddleware(app, isProd);

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (!isProd) {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Replit previews use port 5000 by default. Accepting PORT also lets the
  // packaged production server be smoke-tested without disrupting the preview.
  const port = Number(process.env.PORT) || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
