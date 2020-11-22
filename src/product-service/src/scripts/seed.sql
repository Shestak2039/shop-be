CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS stocks CASCADE;
CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text,
    price integer,
	imageURL text
);
CREATE TABLE stocks (
	product_id uuid PRIMARY KEY REFERENCES products(id),
    count integer
);
INSERT INTO products (title, description, price, imageURL) VALUES
('The Witcher 3: Wild Hunt', 'The Witcher 3: Wild Hunt', '8', 'https://upload.wikimedia.org/wikipedia/ru/thumb/a/a2/The_Witcher_3-_Wild_Hunt_Cover.jpg/274px-The_Witcher_3-_Wild_Hunt_Cover.jpg'),
('Cyberpunk 2077', 'Cyberpunk 2077', '30', 'https://upload.wikimedia.org/wikipedia/ru/thumb/b/bb/%D0%9E%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B0_%D0%BA%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%D0%BD%D0%BE%D0%B9_%D0%B8%D0%B3%D1%80%D1%8B_Cyberpunk_2077.jpg/274px-%D0%9E%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B0_%D0%BA%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%D0%BD%D0%BE%D0%B9_%D0%B8%D0%B3%D1%80%D1%8B_Cyberpunk_2077.jpg'),
('Grand Theft Auto V', 'Grand Theft Auto V', '20', 'https://upload.wikimedia.org/wikipedia/ru/thumb/c/c8/GTAV_Official_Cover_Art.jpg/274px-GTAV_Official_Cover_Art.jpg'),
('Red Dead Redemption 2', 'Red Dead Redemption 2', '50', 'https://upload.wikimedia.org/wikipedia/ru/thumb/0/03/Red_Dead_Redemption_2_coverart.jpg/274px-Red_Dead_Redemption_2_coverart.jpg'),
('Tom Clancy Rainbow Six Siege', 'Tom Clancy Rainbow Six Siege', '15', 'https://upload.wikimedia.org/wikipedia/ru/thumb/d/db/Rrainbow6_PS4.jpg/274px-Rrainbow6_PS4.jpg'),
('Mortal Kombat 11', 'Mortal Kombat 11', '30', 'https://upload.wikimedia.org/wikipedia/ru/thumb/4/4e/Mortal_Kombat_11.jpg/274px-Mortal_Kombat_11.jpg'),
('Among Us', 'Among Us', '3', 'https://upload.wikimedia.org/wikipedia/ru/thumb/8/84/Among_Us.png/274px-Among_Us.png'),
('Death Stranding', 'Death Stranding', '50', 'https://upload.wikimedia.org/wikipedia/ru/thumb/e/ee/Death_Stranding_Poster.jpg/258px-Death_Stranding_Poster.jpg');
INSERT INTO stocks (product_id, count) VALUES
((SELECT id FROM products WHERE title = 'The Witcher 3: Wild Hunt'), '20'),
((SELECT id FROM products WHERE title = 'Cyberpunk 2077'), '15'),
((SELECT id FROM products WHERE title = 'Grand Theft Auto V'), '10'),
((SELECT id FROM products WHERE title = 'Red Dead Redemption 2'), '10'),
((SELECT id FROM products WHERE title = 'Tom Clancy Rainbow Six Siege'), '30'),
((SELECT id FROM products WHERE title = 'Mortal Kombat 11'), '15'),
((SELECT id FROM products WHERE title = 'Among Us'), '100'),
((SELECT id FROM products WHERE title = 'Death Stranding'), '10');
