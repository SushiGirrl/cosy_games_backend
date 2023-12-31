DROP TABLE IF EXISTS games_consoles;
DROP TABLE IF EXISTS users_games_status;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS consoles;
DROP TABLE IF EXISTS users;

CREATE TABLE games (
    game_id INT AUTO_INCREMENT PRIMARY KEY,
    game_name VARCHAR(30),
    rating_metascore INT,
    price_dk DECIMAL(10, 2),
    length_hours DECIMAL(10, 1),
    dev_status VARCHAR(30),
    multiplayer VARCHAR(30),
    cross_platform VARCHAR(30),
    artstyle VARCHAR(30)
);

CREATE TABLE consoles (
    console_id INT AUTO_INCREMENT PRIMARY KEY,
    console VARCHAR(30)
);

CREATE TABLE games_consoles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT,
    console_id INT,
    FOREIGN KEY (game_id) REFERENCES games(game_id),
    FOREIGN KEY (console_id) REFERENCES consoles(console_id)
);

CREATE TABLE users (
	user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(30)
);

CREATE TABLE users_games_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    game_id INT,
    play_status VARCHAR(30),
	FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (game_id) REFERENCES games(game_id)
);

INSERT INTO games (game_name, rating_metascore, price_dk, length_hours, dev_status, multiplayer, cross_platform, artstyle)
VALUES
    ('Stardew Valley', 89, 104.32, 160, 'finished', 'yes', 'yes', 'pixel art'),
    ('Sun Haven', NULL, 156.52, 216, 'finished', 'yes', 'no', 'pixel art'), -- Adjusted for missing rating_metascore
    ('Coral Island', 82, 223.64, 60, 'finished', 'coming', 'yes', '3D'),
    ('Unpacking', 83, 149.07, 4.5, 'finished', 'no', 'no', 'pixel art'),
    ('Don´t Starve Together', 83, 111.78, 300, 'finished', 'yes', 'no', '2D'),
    ('Little witch in the Woods', NULL, 106.56, 12, 'early access', 'no', 'no', 'pixel art'), -- Adjusted for missing rating_metascore
    ('The Cosmic Wheel Sisterhood', 85, 130.42, 11.5, 'finished', 'no', 'no', 'pixel art'),
    ('Pokemon FireRed Version', 81, 30, 148, 'finished', 'no', 'no', 'pixel art');

INSERT INTO consoles (console)
VALUES
    ('PC'), ('PS'), ('Xbox'), ('Switch'), ('Gameboy Advanced'), ('Nintendo DS');
    
INSERT INTO games_consoles (game_id, console_id)
VALUES
    (1, 1), -- Stardew Valley on PC
    (1, 2), -- Stardew Valley on PS
    (1, 3), -- Stardew Valley on Xbox
    (1, 4), -- Stardew Valley on Switch
    (2, 1), -- Sun Haven on PC
    (3, 1), -- Coral Island on PC
    (3, 2), -- Coral Island on PS
    (3, 3), -- Coral Island on Xbox
    (4, 1), -- Unpacking on PC
    (4, 2), -- Unpacking on PS
    (4, 3), -- Unpacking on Xbox
    (4, 4), -- Unpacking on Switch
    (5, 1), -- Don't Starve Together on PC
    (5, 2), -- Don't Starve Together on PS
    (5, 3), -- Don't Starve Together on Xbox
    (5, 4), -- Don't Starve Together on Switch
    (6, 1), -- Little witch in the Woods on PC
    (6, 3), -- Little witch in the Woods on Xbox
    (7, 1), -- The Cosmic Wheel Sisterhood on PC
    (7, 4), -- The Cosmic Wheel Sisterhood on Switch
    (8, 5), -- Pokemon FireRed Version on Gameboy Advanced
    (8, 6); -- Pokemon FireRed Version on Nintendo DS
