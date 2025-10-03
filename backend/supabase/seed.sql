SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict yjvqTBUPQ5ukNc8cJgVgeYrGkoWWNmXJQwJCWYhghPlmDuLYyqoBe1vX1oLlbqo

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '1f3f2b8b-de60-44a3-9f57-0b54a62bc4c6', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"nguyenkhoa14022002@gmail.com","user_id":"e9e61705-a109-4847-88ee-a5102b08ba94","user_phone":""}}', '2025-09-23 03:12:27.67985+00', ''),
	('00000000-0000-0000-0000-000000000000', '396653ca-8223-4110-a446-5b0ef4750f35', '{"action":"login","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-24 03:33:01.201151+00', ''),
	('00000000-0000-0000-0000-000000000000', '8743fadf-dfcf-4256-b89f-bab39bc3570d', '{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"khoa.nguyen@zen8labs.com","user_id":"8903abda-cd74-48d4-ae4d-5004afbce156"}}', '2025-09-24 04:22:44.943551+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fe981b86-eec6-4885-b8a7-5304903d4e9b', '{"action":"user_signedup","actor_id":"8903abda-cd74-48d4-ae4d-5004afbce156","actor_username":"khoa.nguyen@zen8labs.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-09-24 04:23:09.451688+00', ''),
	('00000000-0000-0000-0000-000000000000', '8eb1e723-30b6-43b1-8c23-4a01db384181', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"khoa.nguyen@zen8labs.com","user_id":"8903abda-cd74-48d4-ae4d-5004afbce156","user_phone":""}}', '2025-09-24 04:23:27.441958+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5de656a-c529-46a2-bb65-f9ace64e7425', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"nguyenkhoa14062002@gmail.com","user_id":"9545b4a7-90f8-43d8-8d5c-99275883aa25","user_phone":""}}', '2025-09-24 13:00:27.529394+00', ''),
	('00000000-0000-0000-0000-000000000000', '1fad73ea-b7c3-48f3-a52d-cf75ee8b19f3', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"khoa@example.com","user_id":"b4aa2aa5-c60d-4edc-9b64-9e89f15baf30","user_phone":""}}', '2025-09-24 13:22:03.98156+00', ''),
	('00000000-0000-0000-0000-000000000000', '46c327b2-b810-4a9b-8f69-402639e3bfa8', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"dung@example.com","user_id":"be3e0957-d2ef-45a4-99df-891e8c6cffd3","user_phone":""}}', '2025-09-24 13:23:13.347482+00', ''),
	('00000000-0000-0000-0000-000000000000', '0c7b9888-a74d-49aa-a8fe-2bbea3c785eb', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"dat@example.com","user_id":"d914d205-6b10-49c7-8d15-2c7db6744925","user_phone":""}}', '2025-09-24 13:23:38.378879+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fd96b688-5007-473d-ac99-68a825dfe29d', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"binh@example.com","user_id":"1d3edb52-f03c-4e6c-b65e-8f4806841079","user_phone":""}}', '2025-09-24 13:24:17.111262+00', ''),
	('00000000-0000-0000-0000-000000000000', '0d2b26d9-ef03-4ce9-bb69-9b497457cb17', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"bao@example.com","user_id":"b10f0319-49be-4352-a0f9-020980a209ed","user_phone":""}}', '2025-09-24 13:24:42.063196+00', ''),
	('00000000-0000-0000-0000-000000000000', '7d78a297-e5f3-4b9b-bed3-2aae7d0cf4cc', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"viet@example.com","user_id":"2eeb3d54-8f11-4041-8a1d-875fc420fd7e","user_phone":""}}', '2025-09-24 13:25:11.293739+00', ''),
	('00000000-0000-0000-0000-000000000000', '16e4d9ec-714e-4ba9-afe4-2e48c2d3d81a', '{"action":"login","actor_id":"be3e0957-d2ef-45a4-99df-891e8c6cffd3","actor_username":"dung@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-24 14:08:07.160878+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b51ae69-f669-489e-8805-a77f1ecaefaa', '{"action":"login","actor_id":"be3e0957-d2ef-45a4-99df-891e8c6cffd3","actor_username":"dung@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-24 14:08:25.451389+00', ''),
	('00000000-0000-0000-0000-000000000000', '53be2df5-cd84-4dd3-9e99-9618f4a5fef6', '{"action":"login","actor_id":"be3e0957-d2ef-45a4-99df-891e8c6cffd3","actor_username":"dung@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-24 14:18:42.365175+00', ''),
	('00000000-0000-0000-0000-000000000000', '63149938-b32e-4337-9f6b-194671a5773c', '{"action":"login","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-24 22:21:37.051871+00', ''),
	('00000000-0000-0000-0000-000000000000', '48290676-244f-4993-947d-d39b59184d09', '{"action":"login","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-24 22:21:46.347026+00', ''),
	('00000000-0000-0000-0000-000000000000', '8aff4730-1bba-46c8-950b-432179c8d097', '{"action":"login","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-24 22:27:20.283027+00', ''),
	('00000000-0000-0000-0000-000000000000', 'acf67c2a-12e9-4956-8058-89913450364e', '{"action":"login","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-24 22:28:26.867268+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd215ebf5-cd2c-4297-bab4-422d48299625', '{"action":"login","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-24 22:28:37.087217+00', ''),
	('00000000-0000-0000-0000-000000000000', '88dae85d-3f0e-4f36-b9d4-fb739e7a53bb', '{"action":"login","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-24 22:29:35.013771+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a02d2ff6-8836-4bfb-b341-4ecfe81a4ea7', '{"action":"login","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-24 22:31:23.437479+00', ''),
	('00000000-0000-0000-0000-000000000000', '6afcb006-b235-4f04-9c04-1c7a91f3f25a', '{"action":"login","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-24 22:42:18.471739+00', ''),
	('00000000-0000-0000-0000-000000000000', '75eba41f-388b-45b0-b47b-565d95196ec3', '{"action":"login","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-24 23:28:19.838204+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd6daedce-4364-41ec-b878-fbdfacf27a0f', '{"action":"login","actor_id":"be3e0957-d2ef-45a4-99df-891e8c6cffd3","actor_username":"dung@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-25 05:55:17.480382+00', ''),
	('00000000-0000-0000-0000-000000000000', '831fb14c-fd4d-45dc-a3d9-6ca417d6d4a7', '{"action":"login","actor_id":"be3e0957-d2ef-45a4-99df-891e8c6cffd3","actor_username":"dung@example.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-25 07:10:31.427686+00', ''),
	('00000000-0000-0000-0000-000000000000', '8cdb6a89-f20e-44dc-a338-6dbe3aa53db9', '{"action":"login","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-25 10:00:07.115955+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ef377674-308f-47c9-a5e2-a6a0ce33ebd4', '{"action":"login","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-25 10:03:53.05918+00', ''),
	('00000000-0000-0000-0000-000000000000', '7b907b3b-c594-4d63-a2c4-e1c2cf8ff1e5', '{"action":"login","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-25 21:26:40.961535+00', ''),
	('00000000-0000-0000-0000-000000000000', '57ae92d7-ac95-4325-aca4-d7a6a2fc2e65', '{"action":"token_refreshed","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 22:24:44.643636+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a58b1019-46c8-4569-a472-b1af054528d7', '{"action":"token_revoked","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 22:24:44.660978+00', ''),
	('00000000-0000-0000-0000-000000000000', '5fc88f26-0e0f-44a2-8993-43bfcd633eb6', '{"action":"token_refreshed","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 23:23:15.406547+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac14f3e9-46be-4bef-b403-4a545028e6ed', '{"action":"token_revoked","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-25 23:23:15.419201+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d3e6640-a5c6-4d66-b68c-40cd3dad4f2c', '{"action":"token_refreshed","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 00:21:46.350256+00', ''),
	('00000000-0000-0000-0000-000000000000', '2e7c070b-0833-434c-8118-8d56eca5dc28', '{"action":"token_revoked","actor_id":"e9e61705-a109-4847-88ee-a5102b08ba94","actor_username":"nguyenkhoa14022002@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-26 00:21:46.36125+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'e9e61705-a109-4847-88ee-a5102b08ba94', 'authenticated', 'authenticated', 'nguyenkhoa14022002@gmail.com', '$2a$10$qTiR8qO8oj10aPKsxMFqDOpAcJx0Rogs/m6JPbnU6rq0FdKTVO5z6', '2025-09-23 03:12:27.694425+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-09-25 21:26:40.99986+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-23 03:12:27.634975+00', '2025-09-26 00:21:46.379542+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'd914d205-6b10-49c7-8d15-2c7db6744925', 'authenticated', 'authenticated', 'dat@example.com', '$2a$10$U6g29QVsCDYTzs39xnxEpeaGRZRYGXUHzrKvHDtTlGHdV1DrQqjzy', '2025-09-24 13:23:38.379929+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-24 13:23:38.374363+00', '2025-09-24 13:23:38.381304+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '1d3edb52-f03c-4e6c-b65e-8f4806841079', 'authenticated', 'authenticated', 'binh@example.com', '$2a$10$S/ojWbqsKjzhJqVgk/Jm/.QIoTeezJ.CVhEx28/1QpOljrwXoJUoG', '2025-09-24 13:24:17.115597+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-24 13:24:17.10225+00', '2025-09-24 13:24:17.117757+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '9545b4a7-90f8-43d8-8d5c-99275883aa25', 'authenticated', 'authenticated', 'nguyenkhoa14062002@gmail.com', '$2a$10$9V1OufCQ0N5tW2D7HzFMMeg6mg/tHD1Tirma3J/FkOLj.ecyKCVrm', '2025-09-24 13:00:27.538867+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-24 13:00:27.499324+00', '2025-09-24 13:00:27.540429+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b10f0319-49be-4352-a0f9-020980a209ed', 'authenticated', 'authenticated', 'bao@example.com', '$2a$10$5.jkhPPjD8/ZhmeyX4FvYOlrH/Wjj74Y75rs.KpGe//JVY3THduHK', '2025-09-24 13:24:42.064371+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-24 13:24:42.059906+00', '2025-09-24 13:24:42.065087+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b4aa2aa5-c60d-4edc-9b64-9e89f15baf30', 'authenticated', 'authenticated', 'khoa@example.com', '$2a$10$JtVB5lGtJGT5cRuujffAkeWCzUEG/Pc73LeyqHsxL9iOIRi5VKki6', '2025-09-24 13:22:03.987496+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-24 13:22:03.965233+00', '2025-09-24 13:22:03.992118+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'be3e0957-d2ef-45a4-99df-891e8c6cffd3', 'authenticated', 'authenticated', 'dung@example.com', '$2a$10$nIGP96rqOdkbPHnjMyi8q.CUoeGFWINM4hbk2GKa0kWaGZNukHZF6', '2025-09-24 13:23:13.36384+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-09-25 07:10:31.442783+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-24 13:23:13.303867+00', '2025-09-25 07:10:31.466201+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '2eeb3d54-8f11-4041-8a1d-875fc420fd7e', 'authenticated', 'authenticated', 'viet@example.com', '$2a$10$QfpQGO0gVmNzc5JTss8Rh.YVkZOAJ8Abu6wp2BkEApGi.lXV.Dfq6', '2025-09-24 13:25:11.295516+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-24 13:25:11.29075+00', '2025-09-24 13:25:11.296299+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('e9e61705-a109-4847-88ee-a5102b08ba94', 'e9e61705-a109-4847-88ee-a5102b08ba94', '{"sub": "e9e61705-a109-4847-88ee-a5102b08ba94", "email": "nguyenkhoa14022002@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-23 03:12:27.669132+00', '2025-09-23 03:12:27.669622+00', '2025-09-23 03:12:27.669622+00', '5537c202-4350-450b-9356-519370e47a34'),
	('9545b4a7-90f8-43d8-8d5c-99275883aa25', '9545b4a7-90f8-43d8-8d5c-99275883aa25', '{"sub": "9545b4a7-90f8-43d8-8d5c-99275883aa25", "email": "nguyenkhoa14062002@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-24 13:00:27.521153+00', '2025-09-24 13:00:27.52185+00', '2025-09-24 13:00:27.52185+00', 'f2970cc0-07b9-469e-8ead-5ca4b9359e88'),
	('b4aa2aa5-c60d-4edc-9b64-9e89f15baf30', 'b4aa2aa5-c60d-4edc-9b64-9e89f15baf30', '{"sub": "b4aa2aa5-c60d-4edc-9b64-9e89f15baf30", "email": "khoa@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-24 13:22:03.978533+00', '2025-09-24 13:22:03.979736+00', '2025-09-24 13:22:03.979736+00', '376d7ac9-0ca5-4029-b568-1526a11b420d'),
	('be3e0957-d2ef-45a4-99df-891e8c6cffd3', 'be3e0957-d2ef-45a4-99df-891e8c6cffd3', '{"sub": "be3e0957-d2ef-45a4-99df-891e8c6cffd3", "email": "dung@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-24 13:23:13.334458+00', '2025-09-24 13:23:13.334518+00', '2025-09-24 13:23:13.334518+00', '5dc49bbe-6fd2-4498-99f7-a2e10836a6e8'),
	('d914d205-6b10-49c7-8d15-2c7db6744925', 'd914d205-6b10-49c7-8d15-2c7db6744925', '{"sub": "d914d205-6b10-49c7-8d15-2c7db6744925", "email": "dat@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-24 13:23:38.377953+00', '2025-09-24 13:23:38.378006+00', '2025-09-24 13:23:38.378006+00', '85058032-0a33-4b18-a495-23c657d99fa3'),
	('1d3edb52-f03c-4e6c-b65e-8f4806841079', '1d3edb52-f03c-4e6c-b65e-8f4806841079', '{"sub": "1d3edb52-f03c-4e6c-b65e-8f4806841079", "email": "binh@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-24 13:24:17.107093+00', '2025-09-24 13:24:17.107151+00', '2025-09-24 13:24:17.107151+00', '212483f4-423c-44ac-8784-bf6a0ce6d99a'),
	('b10f0319-49be-4352-a0f9-020980a209ed', 'b10f0319-49be-4352-a0f9-020980a209ed', '{"sub": "b10f0319-49be-4352-a0f9-020980a209ed", "email": "bao@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-24 13:24:42.061661+00', '2025-09-24 13:24:42.06172+00', '2025-09-24 13:24:42.06172+00', 'aff76e4d-5ee4-4fca-92f5-ecb547a92055'),
	('2eeb3d54-8f11-4041-8a1d-875fc420fd7e', '2eeb3d54-8f11-4041-8a1d-875fc420fd7e', '{"sub": "2eeb3d54-8f11-4041-8a1d-875fc420fd7e", "email": "viet@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-24 13:25:11.291866+00', '2025-09-24 13:25:11.291918+00', '2025-09-24 13:25:11.291918+00', 'bb9307b1-f3ef-4a1f-8348-ff3e5f6eaf61');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('d76420fe-06b1-4916-ac6b-a6662ea657df', 'e9e61705-a109-4847-88ee-a5102b08ba94', '2025-09-24 03:33:01.224915+00', '2025-09-24 03:33:01.224915+00', NULL, 'aal1', NULL, NULL, 'node', '118.70.128.13', NULL),
	('d76a3dcb-5850-42a0-80a3-4a1bff03df6f', 'be3e0957-d2ef-45a4-99df-891e8c6cffd3', '2025-09-24 14:08:07.173809+00', '2025-09-24 14:08:07.173809+00', NULL, 'aal1', NULL, NULL, 'node', '42.117.235.44', NULL),
	('8faef57e-f680-423a-b284-edd6a5d53da5', 'be3e0957-d2ef-45a4-99df-891e8c6cffd3', '2025-09-24 14:08:25.45593+00', '2025-09-24 14:08:25.45593+00', NULL, 'aal1', NULL, NULL, 'node', '42.117.235.44', NULL),
	('31261c95-4ec5-404d-a4e4-b1d4ad5541c4', 'be3e0957-d2ef-45a4-99df-891e8c6cffd3', '2025-09-24 14:18:42.376999+00', '2025-09-24 14:18:42.376999+00', NULL, 'aal1', NULL, NULL, 'node', '42.117.235.44', NULL),
	('41cf05dd-1843-4054-ac6e-23dbc54c6035', 'e9e61705-a109-4847-88ee-a5102b08ba94', '2025-09-24 22:21:37.086198+00', '2025-09-24 22:21:37.086198+00', NULL, 'aal1', NULL, NULL, 'node', '42.113.129.115', NULL),
	('69dffa05-bcf5-4e80-89af-f68075f1c14a', 'e9e61705-a109-4847-88ee-a5102b08ba94', '2025-09-24 22:21:46.34903+00', '2025-09-24 22:21:46.34903+00', NULL, 'aal1', NULL, NULL, 'node', '42.113.129.115', NULL),
	('e6839bbd-5b0e-455d-8590-af10435f972d', 'e9e61705-a109-4847-88ee-a5102b08ba94', '2025-09-24 22:27:20.299015+00', '2025-09-24 22:27:20.299015+00', NULL, 'aal1', NULL, NULL, 'node', '42.113.129.115', NULL),
	('a3855795-34e8-4ff0-a324-19a81c42beeb', 'e9e61705-a109-4847-88ee-a5102b08ba94', '2025-09-24 22:28:26.87032+00', '2025-09-24 22:28:26.87032+00', NULL, 'aal1', NULL, NULL, 'node', '42.113.129.115', NULL),
	('80811bc6-4b93-43a3-8c5f-e317d8698863', 'e9e61705-a109-4847-88ee-a5102b08ba94', '2025-09-24 22:28:37.090357+00', '2025-09-24 22:28:37.090357+00', NULL, 'aal1', NULL, NULL, 'node', '42.113.129.115', NULL),
	('60919067-4d01-4851-a4d4-0b1e1ac94a2b', 'e9e61705-a109-4847-88ee-a5102b08ba94', '2025-09-24 22:29:35.016034+00', '2025-09-24 22:29:35.016034+00', NULL, 'aal1', NULL, NULL, 'node', '42.113.129.115', NULL),
	('b469d635-f68b-4d4f-8086-e71168b79d24', 'e9e61705-a109-4847-88ee-a5102b08ba94', '2025-09-24 22:31:23.439203+00', '2025-09-24 22:31:23.439203+00', NULL, 'aal1', NULL, NULL, 'node', '42.113.129.115', NULL),
	('69bd7b51-50dc-4ae9-972e-c2731549f7e5', 'e9e61705-a109-4847-88ee-a5102b08ba94', '2025-09-24 22:42:18.480189+00', '2025-09-24 22:42:18.480189+00', NULL, 'aal1', NULL, NULL, 'node', '42.113.129.115', NULL),
	('f559e947-8c42-4104-bd7f-4d3fa2f9ea7e', 'e9e61705-a109-4847-88ee-a5102b08ba94', '2025-09-24 23:28:19.86623+00', '2025-09-24 23:28:19.86623+00', NULL, 'aal1', NULL, NULL, 'node', '42.113.129.115', NULL),
	('a62eae00-0530-4d40-960c-b1714f66855c', 'be3e0957-d2ef-45a4-99df-891e8c6cffd3', '2025-09-25 05:55:17.500984+00', '2025-09-25 05:55:17.500984+00', NULL, 'aal1', NULL, NULL, 'node', '118.70.128.13', NULL),
	('607f4ec3-7509-4ae8-ada0-f5a335e603f8', 'be3e0957-d2ef-45a4-99df-891e8c6cffd3', '2025-09-25 07:10:31.442907+00', '2025-09-25 07:10:31.442907+00', NULL, 'aal1', NULL, NULL, 'node', '118.70.128.13', NULL),
	('fe379cd6-8cb5-4d5a-bb4a-9305c433525a', 'e9e61705-a109-4847-88ee-a5102b08ba94', '2025-09-25 10:00:07.157213+00', '2025-09-25 10:00:07.157213+00', NULL, 'aal1', NULL, NULL, 'node', '118.70.128.13', NULL),
	('72bc989c-64e7-4869-8fae-4478808f4265', 'e9e61705-a109-4847-88ee-a5102b08ba94', '2025-09-25 10:03:53.072836+00', '2025-09-25 10:03:53.072836+00', NULL, 'aal1', NULL, NULL, 'node', '118.70.128.13', NULL),
	('d33a1ae4-7dda-40cc-99a7-f5fcf3befa8f', 'e9e61705-a109-4847-88ee-a5102b08ba94', '2025-09-25 21:26:41.00177+00', '2025-09-26 00:21:46.386778+00', NULL, 'aal1', NULL, '2025-09-26 00:21:46.386698', 'node', '113.23.91.104', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('d76420fe-06b1-4916-ac6b-a6662ea657df', '2025-09-24 03:33:01.312156+00', '2025-09-24 03:33:01.312156+00', 'password', '76a97fdc-daf8-48a6-9445-30abcee33670'),
	('d76a3dcb-5850-42a0-80a3-4a1bff03df6f', '2025-09-24 14:08:07.205753+00', '2025-09-24 14:08:07.205753+00', 'password', 'a8145f08-ae0f-4523-9562-3c01d7a99dbc'),
	('8faef57e-f680-423a-b284-edd6a5d53da5', '2025-09-24 14:08:25.462257+00', '2025-09-24 14:08:25.462257+00', 'password', '9aa97cb3-9b73-4385-94f4-192977dfc9d6'),
	('31261c95-4ec5-404d-a4e4-b1d4ad5541c4', '2025-09-24 14:18:42.405199+00', '2025-09-24 14:18:42.405199+00', 'password', '96fe8854-2218-4816-a868-b9c26d17cfda'),
	('41cf05dd-1843-4054-ac6e-23dbc54c6035', '2025-09-24 22:21:37.173061+00', '2025-09-24 22:21:37.173061+00', 'password', 'd7a7de4b-7bb0-45d3-a7a0-9e96e37188cc'),
	('69dffa05-bcf5-4e80-89af-f68075f1c14a', '2025-09-24 22:21:46.353468+00', '2025-09-24 22:21:46.353468+00', 'password', '6c7cd6e1-5429-4b5e-ad61-e892a6988c59'),
	('e6839bbd-5b0e-455d-8590-af10435f972d', '2025-09-24 22:27:20.313958+00', '2025-09-24 22:27:20.313958+00', 'password', 'b37ed41b-b9f4-40da-9e9b-8f55cd496ad7'),
	('a3855795-34e8-4ff0-a324-19a81c42beeb', '2025-09-24 22:28:26.882218+00', '2025-09-24 22:28:26.882218+00', 'password', 'e7657d59-69b3-4259-bb2c-6f5029f994b2'),
	('80811bc6-4b93-43a3-8c5f-e317d8698863', '2025-09-24 22:28:37.093523+00', '2025-09-24 22:28:37.093523+00', 'password', '3b815e03-0516-4c5f-90bc-85018e4cf8ee'),
	('60919067-4d01-4851-a4d4-0b1e1ac94a2b', '2025-09-24 22:29:35.021145+00', '2025-09-24 22:29:35.021145+00', 'password', '2265b368-66b7-46db-99d6-de4b646f1e1c'),
	('b469d635-f68b-4d4f-8086-e71168b79d24', '2025-09-24 22:31:23.442351+00', '2025-09-24 22:31:23.442351+00', 'password', 'fb9e9c78-895a-4e90-80f4-863a04122df8'),
	('69bd7b51-50dc-4ae9-972e-c2731549f7e5', '2025-09-24 22:42:18.498404+00', '2025-09-24 22:42:18.498404+00', 'password', 'fedcfffb-a37e-4c9f-8b3a-8ddf0d306a4e'),
	('f559e947-8c42-4104-bd7f-4d3fa2f9ea7e', '2025-09-24 23:28:19.91463+00', '2025-09-24 23:28:19.91463+00', 'password', '1eafa573-4a1b-48d3-bae8-76226d1083ee'),
	('a62eae00-0530-4d40-960c-b1714f66855c', '2025-09-25 05:55:17.564075+00', '2025-09-25 05:55:17.564075+00', 'password', '634a73d3-4dfd-44f8-8ddd-7cf244bbd7a1'),
	('607f4ec3-7509-4ae8-ada0-f5a335e603f8', '2025-09-25 07:10:31.468886+00', '2025-09-25 07:10:31.468886+00', 'password', 'f7a584fc-f0da-4dde-96d3-29737c547886'),
	('fe379cd6-8cb5-4d5a-bb4a-9305c433525a', '2025-09-25 10:00:07.236079+00', '2025-09-25 10:00:07.236079+00', 'password', '4b5dabbc-5307-4326-901c-c4c40d1b3825'),
	('72bc989c-64e7-4869-8fae-4478808f4265', '2025-09-25 10:03:53.086135+00', '2025-09-25 10:03:53.086135+00', 'password', '9e280345-a811-4f22-87f3-494af9039c8f'),
	('d33a1ae4-7dda-40cc-99a7-f5fcf3befa8f', '2025-09-25 21:26:41.079634+00', '2025-09-25 21:26:41.079634+00', 'password', '4532a0cf-b059-4beb-9abb-f60d45c9d130');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, '25juuxjcgmmd', 'e9e61705-a109-4847-88ee-a5102b08ba94', false, '2025-09-24 03:33:01.260605+00', '2025-09-24 03:33:01.260605+00', NULL, 'd76420fe-06b1-4916-ac6b-a6662ea657df'),
	('00000000-0000-0000-0000-000000000000', 3, 'zmrkgud5y2nr', 'be3e0957-d2ef-45a4-99df-891e8c6cffd3', false, '2025-09-24 14:08:07.186275+00', '2025-09-24 14:08:07.186275+00', NULL, 'd76a3dcb-5850-42a0-80a3-4a1bff03df6f'),
	('00000000-0000-0000-0000-000000000000', 4, 'ltexh7s2phs6', 'be3e0957-d2ef-45a4-99df-891e8c6cffd3', false, '2025-09-24 14:08:25.458043+00', '2025-09-24 14:08:25.458043+00', NULL, '8faef57e-f680-423a-b284-edd6a5d53da5'),
	('00000000-0000-0000-0000-000000000000', 5, 'yfxx4j2dqex7', 'be3e0957-d2ef-45a4-99df-891e8c6cffd3', false, '2025-09-24 14:18:42.388925+00', '2025-09-24 14:18:42.388925+00', NULL, '31261c95-4ec5-404d-a4e4-b1d4ad5541c4'),
	('00000000-0000-0000-0000-000000000000', 6, 'ohkofswmr3as', 'e9e61705-a109-4847-88ee-a5102b08ba94', false, '2025-09-24 22:21:37.116049+00', '2025-09-24 22:21:37.116049+00', NULL, '41cf05dd-1843-4054-ac6e-23dbc54c6035'),
	('00000000-0000-0000-0000-000000000000', 7, 'zbtbwzkuym5e', 'e9e61705-a109-4847-88ee-a5102b08ba94', false, '2025-09-24 22:21:46.351011+00', '2025-09-24 22:21:46.351011+00', NULL, '69dffa05-bcf5-4e80-89af-f68075f1c14a'),
	('00000000-0000-0000-0000-000000000000', 8, '6hpzblun6j6o', 'e9e61705-a109-4847-88ee-a5102b08ba94', false, '2025-09-24 22:27:20.304216+00', '2025-09-24 22:27:20.304216+00', NULL, 'e6839bbd-5b0e-455d-8590-af10435f972d'),
	('00000000-0000-0000-0000-000000000000', 9, 'jodzwprheh5f', 'e9e61705-a109-4847-88ee-a5102b08ba94', false, '2025-09-24 22:28:26.872707+00', '2025-09-24 22:28:26.872707+00', NULL, 'a3855795-34e8-4ff0-a324-19a81c42beeb'),
	('00000000-0000-0000-0000-000000000000', 10, 'hsstizjufgmr', 'e9e61705-a109-4847-88ee-a5102b08ba94', false, '2025-09-24 22:28:37.091169+00', '2025-09-24 22:28:37.091169+00', NULL, '80811bc6-4b93-43a3-8c5f-e317d8698863'),
	('00000000-0000-0000-0000-000000000000', 11, 'ilq7hbnkoctm', 'e9e61705-a109-4847-88ee-a5102b08ba94', false, '2025-09-24 22:29:35.018603+00', '2025-09-24 22:29:35.018603+00', NULL, '60919067-4d01-4851-a4d4-0b1e1ac94a2b'),
	('00000000-0000-0000-0000-000000000000', 12, 'ayhd72jefxxw', 'e9e61705-a109-4847-88ee-a5102b08ba94', false, '2025-09-24 22:31:23.440352+00', '2025-09-24 22:31:23.440352+00', NULL, 'b469d635-f68b-4d4f-8086-e71168b79d24'),
	('00000000-0000-0000-0000-000000000000', 13, 'fn652mqtm4al', 'e9e61705-a109-4847-88ee-a5102b08ba94', false, '2025-09-24 22:42:18.486692+00', '2025-09-24 22:42:18.486692+00', NULL, '69bd7b51-50dc-4ae9-972e-c2731549f7e5'),
	('00000000-0000-0000-0000-000000000000', 14, 'wln3yowvz33o', 'e9e61705-a109-4847-88ee-a5102b08ba94', false, '2025-09-24 23:28:19.887096+00', '2025-09-24 23:28:19.887096+00', NULL, 'f559e947-8c42-4104-bd7f-4d3fa2f9ea7e'),
	('00000000-0000-0000-0000-000000000000', 15, '3mfiber7thog', 'be3e0957-d2ef-45a4-99df-891e8c6cffd3', false, '2025-09-25 05:55:17.525288+00', '2025-09-25 05:55:17.525288+00', NULL, 'a62eae00-0530-4d40-960c-b1714f66855c'),
	('00000000-0000-0000-0000-000000000000', 16, 'a5placarnmnc', 'be3e0957-d2ef-45a4-99df-891e8c6cffd3', false, '2025-09-25 07:10:31.451145+00', '2025-09-25 07:10:31.451145+00', NULL, '607f4ec3-7509-4ae8-ada0-f5a335e603f8'),
	('00000000-0000-0000-0000-000000000000', 17, 'pntvy7r6rnyk', 'e9e61705-a109-4847-88ee-a5102b08ba94', false, '2025-09-25 10:00:07.185574+00', '2025-09-25 10:00:07.185574+00', NULL, 'fe379cd6-8cb5-4d5a-bb4a-9305c433525a'),
	('00000000-0000-0000-0000-000000000000', 18, 'e7ths5rzjnnd', 'e9e61705-a109-4847-88ee-a5102b08ba94', false, '2025-09-25 10:03:53.076989+00', '2025-09-25 10:03:53.076989+00', NULL, '72bc989c-64e7-4869-8fae-4478808f4265'),
	('00000000-0000-0000-0000-000000000000', 19, 'u652nwk7azvz', 'e9e61705-a109-4847-88ee-a5102b08ba94', true, '2025-09-25 21:26:41.030957+00', '2025-09-25 22:24:44.662455+00', NULL, 'd33a1ae4-7dda-40cc-99a7-f5fcf3befa8f'),
	('00000000-0000-0000-0000-000000000000', 20, 'e6l7feb3ckls', 'e9e61705-a109-4847-88ee-a5102b08ba94', true, '2025-09-25 22:24:44.673424+00', '2025-09-25 23:23:15.423365+00', 'u652nwk7azvz', 'd33a1ae4-7dda-40cc-99a7-f5fcf3befa8f'),
	('00000000-0000-0000-0000-000000000000', 21, 'zboz73bjwfye', 'e9e61705-a109-4847-88ee-a5102b08ba94', true, '2025-09-25 23:23:15.433357+00', '2025-09-26 00:21:46.363783+00', 'e6l7feb3ckls', 'd33a1ae4-7dda-40cc-99a7-f5fcf3befa8f'),
	('00000000-0000-0000-0000-000000000000', 22, '35ol7yz5l6mu', 'e9e61705-a109-4847-88ee-a5102b08ba94', false, '2025-09-26 00:21:46.372369+00', '2025-09-26 00:21:46.372369+00', 'zboz73bjwfye', 'd33a1ae4-7dda-40cc-99a7-f5fcf3befa8f');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: department; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."department" ("id", "name") VALUES
	(1, 'Engineering'),
	(2, 'Delivery'),
	(3, 'Design'),
	(4, 'Solutions'),
	(5, 'Internships'),
	(6, 'People & Partnership'),
	(7, 'Services'),
	(8, 'Growth');


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."role" ("id", "created_at", "role_name") VALUES
	(1, '2025-09-24 03:40:14.741195+00', 'Admin'),
	(2, '2025-09-24 03:40:27.610417+00', 'User');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "created_at", "name", "phone", "role_id", "department_id", "avatar_url") VALUES
	('e9e61705-a109-4847-88ee-a5102b08ba94', '2025-09-24 03:52:37.657427+00', 'Nguyen Khoa', '0377106695', 2, 5, NULL),
	('9545b4a7-90f8-43d8-8d5c-99275883aa25', '2025-09-24 13:03:05.508505+00', 'Nguyen Khang', '0937345398', 2, 5, NULL),
	('d914d205-6b10-49c7-8d15-2c7db6744925', '2025-09-24 13:27:11.354345+00', 'Dat Bui', '097823595', 2, 5, NULL),
	('be3e0957-d2ef-45a4-99df-891e8c6cffd3', '2025-09-24 13:28:07.155997+00', 'Dung Bui', '0987654321', 2, 5, NULL),
	('b4aa2aa5-c60d-4edc-9b64-9e89f15baf30', '2025-09-24 13:29:03.580253+00', 'Khoa Nguyen', '0388765456', 2, 5, NULL),
	('b10f0319-49be-4352-a0f9-020980a209ed', '2025-09-24 13:32:20.826253+00', 'Doan Bao', '0965748321', 2, 5, NULL),
	('2eeb3d54-8f11-4041-8a1d-875fc420fd7e', '2025-09-24 13:33:11.21047+00', 'Viet Nguyen', '09888746352', 2, 5, NULL),
	('1d3edb52-f03c-4e6c-b65e-8f4806841079', '2025-09-24 13:35:18.394029+00', 'Binh Nguyen', '0388374632', 2, 5, NULL);


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."projects" ("id", "created_at", "name", "description", "status", "start_date", "end_date") VALUES
	(1, '2025-09-24 13:06:35.717142+00', 'Project Test', 'This is a demo for temp project', 'IN COMMING', '2025-09-26', '2025-10-24'),
	(2, '2025-09-24 13:07:57.313879+00', 'Project Test 2', 'This is demo for project test 2', 'PROGRESSING', '2025-09-23', '2025-10-29'),
	(3, '2025-09-24 13:08:58.234925+00', 'Project Test 3', 'This is a demo for project test 3', 'COMPLETED', '2025-06-24', '2025-08-26');


--
-- Data for Name: project_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."project_members" ("id", "user_id", "project_id", "project_role") VALUES
	(1, '9545b4a7-90f8-43d8-8d5c-99275883aa25', 1, 'Developer'),
	(2, 'd914d205-6b10-49c7-8d15-2c7db6744925', 1, 'Business Analyst'),
	(4, 'be3e0957-d2ef-45a4-99df-891e8c6cffd3', 1, 'Developer'),
	(5, 'b4aa2aa5-c60d-4edc-9b64-9e89f15baf30', 2, 'Project Manager'),
	(6, 'be3e0957-d2ef-45a4-99df-891e8c6cffd3', 2, 'Developer'),
	(7, '2eeb3d54-8f11-4041-8a1d-875fc420fd7e', 1, 'Tester'),
	(8, '1d3edb52-f03c-4e6c-b65e-8f4806841079', 2, 'Developer'),
	(9, '9545b4a7-90f8-43d8-8d5c-99275883aa25', 3, 'Project Manager'),
	(10, 'd914d205-6b10-49c7-8d15-2c7db6744925', 3, 'Business Analysis');


--
-- Data for Name: project_updates; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."project_updates" ("id", "project_id", "title", "content", "created_at") VALUES
	(1, 1, 'First Update', 'Binh Nguyen has join Project 1', '2025-09-24 13:50:45.001596+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 22, true);


--
-- Name: Department_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.department_id_seq', 8, true);


--
-- Name: Project_Members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_members_id_seq', 10, true);


--
-- Name: Projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."projects_id_seq"', 3, true);


--
-- Name: Role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_id_seq', 2, true);


--
-- Name: notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_id_seq', 1, false);


--
-- Name: project_updates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."project_updates_id_seq"', 1, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict yjvqTBUPQ5ukNc8cJgVgeYrGkoWWNmXJQwJCWYhghPlmDuLYyqoBe1vX1oLlbqo

RESET ALL;
