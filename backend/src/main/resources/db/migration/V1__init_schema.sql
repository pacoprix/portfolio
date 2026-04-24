-- V1: Initial schema

CREATE TABLE projects (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255)  NOT NULL,
    description TEXT,
    tech_stack  VARCHAR(500),
    github_url  VARCHAR(500),
    demo_url    VARCHAR(500),
    image_url   VARCHAR(500),
    featured    BOOLEAN       NOT NULL DEFAULT false,
    created_at  TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE TABLE skills (
    id       BIGSERIAL PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    level    INTEGER      CHECK (level BETWEEN 1 AND 5)
);

CREATE TABLE contact_messages (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    message    TEXT         NOT NULL,
    read       BOOLEAN      NOT NULL DEFAULT false,
    created_at TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE TABLE users (
    id       BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
