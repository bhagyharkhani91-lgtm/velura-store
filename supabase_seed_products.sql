-- Seed file for adding 5-8 dummy products per category


INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'ergonomic-ring-647', 'Ergonomic Ring 647', 'A premium ring designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Ergonomic Ring 647. Crafted from body-safe materials, this luxurious ring features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-1', 82.99, NULL, 
  '[{"id":"img-1-1350","url":"/images/products/premium_3.webp","alt":"Ergonomic Ring 647 front view","isPrimary":true},{"id":"img-2-7156","url":"/images/products/premium_5.webp","alt":"Ergonomic Ring 647 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 64, true, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'discreet-ring-342', 'Discreet Ring 342', 'A premium ring designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Discreet Ring 342. Crafted from body-safe materials, this luxurious ring features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-1', 155.99, NULL, 
  '[{"id":"img-1-9920","url":"/images/products/premium_5.webp","alt":"Discreet Ring 342 front view","isPrimary":true},{"id":"img-2-8438","url":"/images/products/premium_4.webp","alt":"Discreet Ring 342 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 87, true, true, true, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'velvet-masturbator-254', 'Velvet Masturbator 254', 'A premium masturbator designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Velvet Masturbator 254. Crafted from body-safe materials, this luxurious masturbator features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-1', 153.99, NULL, 
  '[{"id":"img-1-9888","url":"/images/products/premium_1.webp","alt":"Velvet Masturbator 254 front view","isPrimary":true},{"id":"img-2-3907","url":"/images/products/premium_2.webp","alt":"Velvet Masturbator 254 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 76, false, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'intimate-prostate-massager-592', 'Intimate Prostate Massager 592', 'A premium prostate massager designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Intimate Prostate Massager 592. Crafted from body-safe materials, this luxurious prostate massager features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-1', 125.99, 145.99, 
  '[{"id":"img-1-2008","url":"/images/products/premium_2.webp","alt":"Intimate Prostate Massager 592 front view","isPrimary":true},{"id":"img-2-8157","url":"/images/products/premium_1.webp","alt":"Intimate Prostate Massager 592 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 69, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'premium-masturbator-606', 'Premium Masturbator 606', 'A premium masturbator designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Premium Masturbator 606. Crafted from body-safe materials, this luxurious masturbator features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-1', 195.99, NULL, 
  '[{"id":"img-1-5830","url":"/images/products/premium_5.webp","alt":"Premium Masturbator 606 front view","isPrimary":true},{"id":"img-2-5000","url":"/images/products/premium_3.webp","alt":"Premium Masturbator 606 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 11, false, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'silicone-ring-177', 'Silicone Ring 177', 'A premium ring designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Silicone Ring 177. Crafted from body-safe materials, this luxurious ring features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-1', 30.99, NULL, 
  '[{"id":"img-1-2285","url":"/images/products/premium_2.webp","alt":"Silicone Ring 177 front view","isPrimary":true},{"id":"img-2-5782","url":"/images/products/premium_1.webp","alt":"Silicone Ring 177 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 97, false, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'sensual-masturbator-589', 'Sensual Masturbator 589', 'A premium masturbator designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Sensual Masturbator 589. Crafted from body-safe materials, this luxurious masturbator features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-1', 46.99, NULL, 
  '[{"id":"img-1-9501","url":"/images/products/premium_5.webp","alt":"Sensual Masturbator 589 front view","isPrimary":true},{"id":"img-2-2377","url":"/images/products/premium_1.webp","alt":"Sensual Masturbator 589 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 76, true, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'silicone-ring-608', 'Silicone Ring 608', 'A premium ring designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Silicone Ring 608. Crafted from body-safe materials, this luxurious ring features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-1', 112.99, 158.99, 
  '[{"id":"img-1-1904","url":"/images/products/premium_4.webp","alt":"Silicone Ring 608 front view","isPrimary":true},{"id":"img-2-1212","url":"/images/products/premium_1.webp","alt":"Silicone Ring 608 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 30, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'luxury-rabbit-178', 'Luxury Rabbit 178', 'A premium rabbit designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Luxury Rabbit 178. Crafted from body-safe materials, this luxurious rabbit features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-2', 151.99, 195.99, 
  '[{"id":"img-1-2646","url":"/images/products/premium_2.webp","alt":"Luxury Rabbit 178 front view","isPrimary":true},{"id":"img-2-8165","url":"/images/products/premium_3.webp","alt":"Luxury Rabbit 178 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 38, true, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'luxury-wand-664', 'Luxury Wand 664', 'A premium wand designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Luxury Wand 664. Crafted from body-safe materials, this luxurious wand features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-2', 50.99, 95.99000000000001, 
  '[{"id":"img-1-9848","url":"/images/products/premium_2.webp","alt":"Luxury Wand 664 front view","isPrimary":true},{"id":"img-2-5652","url":"/images/products/premium_4.webp","alt":"Luxury Wand 664 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 58, true, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'sensual-wand-350', 'Sensual Wand 350', 'A premium wand designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Sensual Wand 350. Crafted from body-safe materials, this luxurious wand features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-2', 63.99, 103.99000000000001, 
  '[{"id":"img-1-8540","url":"/images/products/premium_4.webp","alt":"Sensual Wand 350 front view","isPrimary":true},{"id":"img-2-7623","url":"/images/products/premium_2.webp","alt":"Sensual Wand 350 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 19, true, true, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'sensual-g-spot-massager-665', 'Sensual G-Spot Massager 665', 'A premium g-spot massager designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Sensual G-Spot Massager 665. Crafted from body-safe materials, this luxurious g-spot massager features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-2', 61.99, NULL, 
  '[{"id":"img-1-7665","url":"/images/products/premium_5.webp","alt":"Sensual G-Spot Massager 665 front view","isPrimary":true},{"id":"img-2-6557","url":"/images/products/premium_1.webp","alt":"Sensual G-Spot Massager 665 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 91, false, false, true, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'sensual-wand-891', 'Sensual Wand 891', 'A premium wand designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Sensual Wand 891. Crafted from body-safe materials, this luxurious wand features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-2', 80.99, NULL, 
  '[{"id":"img-1-5768","url":"/images/products/premium_2.webp","alt":"Sensual Wand 891 front view","isPrimary":true},{"id":"img-2-4146","url":"/images/products/premium_1.webp","alt":"Sensual Wand 891 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 83, false, false, true, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'ergonomic-massage-oil-set-556', 'Ergonomic Massage Oil Set 556', 'A premium massage oil set designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Ergonomic Massage Oil Set 556. Crafted from body-safe materials, this luxurious massage oil set features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-3', 169.99, 219.99, 
  '[{"id":"img-1-3484","url":"/images/products/premium_1.webp","alt":"Ergonomic Massage Oil Set 556 front view","isPrimary":true},{"id":"img-2-6080","url":"/images/products/premium_2.webp","alt":"Ergonomic Massage Oil Set 556 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 30, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'classic-massage-oil-set-141', 'Classic Massage Oil Set 141', 'A premium massage oil set designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Classic Massage Oil Set 141. Crafted from body-safe materials, this luxurious massage oil set features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-3', 58.99, NULL, 
  '[{"id":"img-1-2141","url":"/images/products/premium_3.webp","alt":"Classic Massage Oil Set 141 front view","isPrimary":true},{"id":"img-2-3443","url":"/images/products/premium_4.webp","alt":"Classic Massage Oil Set 141 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 30, false, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'velvet-massage-oil-set-734', 'Velvet Massage Oil Set 734', 'A premium massage oil set designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Velvet Massage Oil Set 734. Crafted from body-safe materials, this luxurious massage oil set features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-3', 78.99, NULL, 
  '[{"id":"img-1-6768","url":"/images/products/premium_5.webp","alt":"Velvet Massage Oil Set 734 front view","isPrimary":true},{"id":"img-2-7855","url":"/images/products/premium_4.webp","alt":"Velvet Massage Oil Set 734 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 94, true, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'elegant-remote-vibrator-104', 'Elegant Remote Vibrator 104', 'A premium remote vibrator designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Elegant Remote Vibrator 104. Crafted from body-safe materials, this luxurious remote vibrator features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-3', 120.99, 130.99, 
  '[{"id":"img-1-3322","url":"/images/products/premium_3.webp","alt":"Elegant Remote Vibrator 104 front view","isPrimary":true},{"id":"img-2-1875","url":"/images/products/premium_2.webp","alt":"Elegant Remote Vibrator 104 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 81, false, true, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'elegant-blindfold-909', 'Elegant Blindfold 909', 'A premium blindfold designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Elegant Blindfold 909. Crafted from body-safe materials, this luxurious blindfold features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-3', 137.99, NULL, 
  '[{"id":"img-1-5836","url":"/images/products/premium_2.webp","alt":"Elegant Blindfold 909 front view","isPrimary":true},{"id":"img-2-2080","url":"/images/products/premium_1.webp","alt":"Elegant Blindfold 909 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 29, false, false, true, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'ergonomic-wand-vibrator-825', 'Ergonomic Wand Vibrator 825', 'A premium wand vibrator designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Ergonomic Wand Vibrator 825. Crafted from body-safe materials, this luxurious wand vibrator features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-4', 53.99, 98.99000000000001, 
  '[{"id":"img-1-6222","url":"/images/products/premium_5.webp","alt":"Ergonomic Wand Vibrator 825 front view","isPrimary":true},{"id":"img-2-9278","url":"/images/products/premium_3.webp","alt":"Ergonomic Wand Vibrator 825 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 88, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'silicone-app-controlled-vibrator-255', 'Silicone App-Controlled Vibrator 255', 'A premium app-controlled vibrator designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Silicone App-Controlled Vibrator 255. Crafted from body-safe materials, this luxurious app-controlled vibrator features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-4', 141.99, 179.99, 
  '[{"id":"img-1-8520","url":"/images/products/premium_3.webp","alt":"Silicone App-Controlled Vibrator 255 front view","isPrimary":true},{"id":"img-2-9078","url":"/images/products/premium_1.webp","alt":"Silicone App-Controlled Vibrator 255 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 49, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'velvet-rabbit-vibrator-459', 'Velvet Rabbit Vibrator 459', 'A premium rabbit vibrator designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Velvet Rabbit Vibrator 459. Crafted from body-safe materials, this luxurious rabbit vibrator features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-4', 194.99, 211.99, 
  '[{"id":"img-1-2737","url":"/images/products/premium_2.webp","alt":"Velvet Rabbit Vibrator 459 front view","isPrimary":true},{"id":"img-2-1441","url":"/images/products/premium_5.webp","alt":"Velvet Rabbit Vibrator 459 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 97, false, true, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'intimate-classic-vibrator-375', 'Intimate Classic Vibrator 375', 'A premium classic vibrator designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Intimate Classic Vibrator 375. Crafted from body-safe materials, this luxurious classic vibrator features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-4', 140.99, 173.99, 
  '[{"id":"img-1-4863","url":"/images/products/premium_5.webp","alt":"Intimate Classic Vibrator 375 front view","isPrimary":true},{"id":"img-2-4004","url":"/images/products/premium_1.webp","alt":"Intimate Classic Vibrator 375 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 18, false, true, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'premium-bullet-vibrator-376', 'Premium Bullet Vibrator 376', 'A premium bullet vibrator designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Premium Bullet Vibrator 376. Crafted from body-safe materials, this luxurious bullet vibrator features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-4', 78.99, NULL, 
  '[{"id":"img-1-4290","url":"/images/products/premium_1.webp","alt":"Premium Bullet Vibrator 376 front view","isPrimary":true},{"id":"img-2-6653","url":"/images/products/premium_4.webp","alt":"Premium Bullet Vibrator 376 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 23, false, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'velvet-app-controlled-vibrator-770', 'Velvet App-Controlled Vibrator 770', 'A premium app-controlled vibrator designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Velvet App-Controlled Vibrator 770. Crafted from body-safe materials, this luxurious app-controlled vibrator features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-4', 21.99, 36.989999999999995, 
  '[{"id":"img-1-5122","url":"/images/products/premium_4.webp","alt":"Velvet App-Controlled Vibrator 770 front view","isPrimary":true},{"id":"img-2-1610","url":"/images/products/premium_3.webp","alt":"Velvet App-Controlled Vibrator 770 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 83, false, false, true, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'sensual-bullet-vibrator-707', 'Sensual Bullet Vibrator 707', 'A premium bullet vibrator designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Sensual Bullet Vibrator 707. Crafted from body-safe materials, this luxurious bullet vibrator features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-4', 63.99, NULL, 
  '[{"id":"img-1-2990","url":"/images/products/premium_5.webp","alt":"Sensual Bullet Vibrator 707 front view","isPrimary":true},{"id":"img-2-2194","url":"/images/products/premium_3.webp","alt":"Sensual Bullet Vibrator 707 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 100, false, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'classic-bullet-vibrator-470', 'Classic Bullet Vibrator 470', 'A premium bullet vibrator designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Classic Bullet Vibrator 470. Crafted from body-safe materials, this luxurious bullet vibrator features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-4', 110.99, 154.99, 
  '[{"id":"img-1-9421","url":"/images/products/premium_2.webp","alt":"Classic Bullet Vibrator 470 front view","isPrimary":true},{"id":"img-2-3349","url":"/images/products/premium_3.webp","alt":"Classic Bullet Vibrator 470 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 39, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'intimate-double-ended-dildo-629', 'Intimate Double-Ended Dildo 629', 'A premium double-ended dildo designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Intimate Double-Ended Dildo 629. Crafted from body-safe materials, this luxurious double-ended dildo features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-5', 133.99, NULL, 
  '[{"id":"img-1-8072","url":"/images/products/premium_5.webp","alt":"Intimate Double-Ended Dildo 629 front view","isPrimary":true},{"id":"img-2-6096","url":"/images/products/premium_3.webp","alt":"Intimate Double-Ended Dildo 629 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 55, true, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'velvet-double-ended-dildo-143', 'Velvet Double-Ended Dildo 143', 'A premium double-ended dildo designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Velvet Double-Ended Dildo 143. Crafted from body-safe materials, this luxurious double-ended dildo features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-5', 123.99, 148.99, 
  '[{"id":"img-1-3612","url":"/images/products/premium_4.webp","alt":"Velvet Double-Ended Dildo 143 front view","isPrimary":true},{"id":"img-2-3629","url":"/images/products/premium_3.webp","alt":"Velvet Double-Ended Dildo 143 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 36, true, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'discreet-silicone-dildo-732', 'Discreet Silicone Dildo 732', 'A premium silicone dildo designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Discreet Silicone Dildo 732. Crafted from body-safe materials, this luxurious silicone dildo features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-5', 119.99, NULL, 
  '[{"id":"img-1-2729","url":"/images/products/premium_1.webp","alt":"Discreet Silicone Dildo 732 front view","isPrimary":true},{"id":"img-2-3409","url":"/images/products/premium_5.webp","alt":"Discreet Silicone Dildo 732 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 51, false, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'velvet-realistic-dildo-474', 'Velvet Realistic Dildo 474', 'A premium realistic dildo designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Velvet Realistic Dildo 474. Crafted from body-safe materials, this luxurious realistic dildo features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-5', 133.99, 175.99, 
  '[{"id":"img-1-9734","url":"/images/products/premium_5.webp","alt":"Velvet Realistic Dildo 474 front view","isPrimary":true},{"id":"img-2-3976","url":"/images/products/premium_3.webp","alt":"Velvet Realistic Dildo 474 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 86, false, false, true, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'classic-double-ended-dildo-174', 'Classic Double-Ended Dildo 174', 'A premium double-ended dildo designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Classic Double-Ended Dildo 174. Crafted from body-safe materials, this luxurious double-ended dildo features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-5', 75.99, NULL, 
  '[{"id":"img-1-3886","url":"/images/products/premium_2.webp","alt":"Classic Double-Ended Dildo 174 front view","isPrimary":true},{"id":"img-2-6107","url":"/images/products/premium_3.webp","alt":"Classic Double-Ended Dildo 174 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 26, true, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'luxury-leather-whip-841', 'Luxury Leather Whip 841', 'A premium leather whip designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Luxury Leather Whip 841. Crafted from body-safe materials, this luxurious leather whip features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-6', 193.99, 220.99, 
  '[{"id":"img-1-3850","url":"/images/products/premium_4.webp","alt":"Luxury Leather Whip 841 front view","isPrimary":true},{"id":"img-2-1291","url":"/images/products/premium_3.webp","alt":"Luxury Leather Whip 841 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 35, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'sensual-leather-whip-790', 'Sensual Leather Whip 790', 'A premium leather whip designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Sensual Leather Whip 790. Crafted from body-safe materials, this luxurious leather whip features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-6', 174.99, NULL, 
  '[{"id":"img-1-2637","url":"/images/products/premium_2.webp","alt":"Sensual Leather Whip 790 front view","isPrimary":true},{"id":"img-2-6290","url":"/images/products/premium_1.webp","alt":"Sensual Leather Whip 790 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 50, false, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'luxury-rope-608', 'Luxury Rope 608', 'A premium rope designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Luxury Rope 608. Crafted from body-safe materials, this luxurious rope features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-6', 106.99, NULL, 
  '[{"id":"img-1-3341","url":"/images/products/premium_3.webp","alt":"Luxury Rope 608 front view","isPrimary":true},{"id":"img-2-6655","url":"/images/products/premium_5.webp","alt":"Luxury Rope 608 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 83, false, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'luxury-rope-298', 'Luxury Rope 298', 'A premium rope designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Luxury Rope 298. Crafted from body-safe materials, this luxurious rope features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-6', 32.99, 79.99000000000001, 
  '[{"id":"img-1-9166","url":"/images/products/premium_4.webp","alt":"Luxury Rope 298 front view","isPrimary":true},{"id":"img-2-5133","url":"/images/products/premium_3.webp","alt":"Luxury Rope 298 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 92, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'discreet-collar-125', 'Discreet Collar 125', 'A premium collar designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Discreet Collar 125. Crafted from body-safe materials, this luxurious collar features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-6', 64.99, 88.99, 
  '[{"id":"img-1-4594","url":"/images/products/premium_5.webp","alt":"Discreet Collar 125 front view","isPrimary":true},{"id":"img-2-1156","url":"/images/products/premium_3.webp","alt":"Discreet Collar 125 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 84, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'velvet-prostate-massager-108', 'Velvet Prostate Massager 108', 'A premium prostate massager designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Velvet Prostate Massager 108. Crafted from body-safe materials, this luxurious prostate massager features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-7', 138.99, NULL, 
  '[{"id":"img-1-4177","url":"/images/products/premium_1.webp","alt":"Velvet Prostate Massager 108 front view","isPrimary":true},{"id":"img-2-6875","url":"/images/products/premium_2.webp","alt":"Velvet Prostate Massager 108 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 75, false, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'classic-flared-plug-534', 'Classic Flared Plug 534', 'A premium flared plug designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Classic Flared Plug 534. Crafted from body-safe materials, this luxurious flared plug features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-7', 25.99, 43.989999999999995, 
  '[{"id":"img-1-7746","url":"/images/products/premium_1.webp","alt":"Classic Flared Plug 534 front view","isPrimary":true},{"id":"img-2-1119","url":"/images/products/premium_4.webp","alt":"Classic Flared Plug 534 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 65, false, false, true, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'classic-flared-plug-260', 'Classic Flared Plug 260', 'A premium flared plug designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Classic Flared Plug 260. Crafted from body-safe materials, this luxurious flared plug features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-7', 156.99, 195.99, 
  '[{"id":"img-1-1193","url":"/images/products/premium_2.webp","alt":"Classic Flared Plug 260 front view","isPrimary":true},{"id":"img-2-8969","url":"/images/products/premium_5.webp","alt":"Classic Flared Plug 260 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 20, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'ergonomic-butt-plug-452', 'Ergonomic Butt Plug 452', 'A premium butt plug designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Ergonomic Butt Plug 452. Crafted from body-safe materials, this luxurious butt plug features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-7', 174.99, 196.99, 
  '[{"id":"img-1-9678","url":"/images/products/premium_3.webp","alt":"Ergonomic Butt Plug 452 front view","isPrimary":true},{"id":"img-2-8101","url":"/images/products/premium_1.webp","alt":"Ergonomic Butt Plug 452 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 38, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'luxury-butt-plug-307', 'Luxury Butt Plug 307', 'A premium butt plug designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Luxury Butt Plug 307. Crafted from body-safe materials, this luxurious butt plug features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-7', 115.99, NULL, 
  '[{"id":"img-1-7194","url":"/images/products/premium_2.webp","alt":"Luxury Butt Plug 307 front view","isPrimary":true},{"id":"img-2-1829","url":"/images/products/premium_4.webp","alt":"Luxury Butt Plug 307 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 26, false, false, true, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'elegant-anal-beads-572', 'Elegant Anal Beads 572', 'A premium anal beads designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Elegant Anal Beads 572. Crafted from body-safe materials, this luxurious anal beads features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-7', 60.99, NULL, 
  '[{"id":"img-1-8651","url":"/images/products/premium_1.webp","alt":"Elegant Anal Beads 572 front view","isPrimary":true},{"id":"img-2-2450","url":"/images/products/premium_2.webp","alt":"Elegant Anal Beads 572 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 39, false, true, true, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'velvet-anal-vibrator-473', 'Velvet Anal Vibrator 473', 'A premium anal vibrator designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Velvet Anal Vibrator 473. Crafted from body-safe materials, this luxurious anal vibrator features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-7', 84.99, 102.99, 
  '[{"id":"img-1-7787","url":"/images/products/premium_4.webp","alt":"Velvet Anal Vibrator 473 front view","isPrimary":true},{"id":"img-2-8457","url":"/images/products/premium_2.webp","alt":"Velvet Anal Vibrator 473 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 72, true, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'ergonomic-anal-beads-252', 'Ergonomic Anal Beads 252', 'A premium anal beads designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Ergonomic Anal Beads 252. Crafted from body-safe materials, this luxurious anal beads features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-7', 125.99, 159.99, 
  '[{"id":"img-1-8465","url":"/images/products/premium_2.webp","alt":"Ergonomic Anal Beads 252 front view","isPrimary":true},{"id":"img-2-3348","url":"/images/products/premium_3.webp","alt":"Ergonomic Anal Beads 252 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 46, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'classic-massage-oil-696', 'Classic Massage Oil 696', 'A premium massage oil designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Classic Massage Oil 696. Crafted from body-safe materials, this luxurious massage oil features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-8', 39.99, 72.99000000000001, 
  '[{"id":"img-1-3564","url":"/images/products/premium_4.webp","alt":"Classic Massage Oil 696 front view","isPrimary":true},{"id":"img-2-8020","url":"/images/products/premium_3.webp","alt":"Classic Massage Oil 696 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 23, true, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'elegant-water-based-lube-805', 'Elegant Water-Based Lube 805', 'A premium water-based lube designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Elegant Water-Based Lube 805. Crafted from body-safe materials, this luxurious water-based lube features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-8', 173.99, 199.99, 
  '[{"id":"img-1-4818","url":"/images/products/premium_2.webp","alt":"Elegant Water-Based Lube 805 front view","isPrimary":true},{"id":"img-2-7192","url":"/images/products/premium_5.webp","alt":"Elegant Water-Based Lube 805 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 26, true, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'velvet-silicone-lube-609', 'Velvet Silicone Lube 609', 'A premium silicone lube designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Velvet Silicone Lube 609. Crafted from body-safe materials, this luxurious silicone lube features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-8', 41.99, 87.99000000000001, 
  '[{"id":"img-1-9157","url":"/images/products/premium_4.webp","alt":"Velvet Silicone Lube 609 front view","isPrimary":true},{"id":"img-2-6307","url":"/images/products/premium_5.webp","alt":"Velvet Silicone Lube 609 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 10, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'silicone-flavored-lube-764', 'Silicone Flavored Lube 764', 'A premium flavored lube designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Silicone Flavored Lube 764. Crafted from body-safe materials, this luxurious flavored lube features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-8', 116.99, NULL, 
  '[{"id":"img-1-6289","url":"/images/products/premium_4.webp","alt":"Silicone Flavored Lube 764 front view","isPrimary":true},{"id":"img-2-2391","url":"/images/products/premium_2.webp","alt":"Silicone Flavored Lube 764 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 76, false, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'velvet-silicone-lube-900', 'Velvet Silicone Lube 900', 'A premium silicone lube designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Velvet Silicone Lube 900. Crafted from body-safe materials, this luxurious silicone lube features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-8', 185.99, 222.99, 
  '[{"id":"img-1-8074","url":"/images/products/premium_4.webp","alt":"Velvet Silicone Lube 900 front view","isPrimary":true},{"id":"img-2-7467","url":"/images/products/premium_1.webp","alt":"Velvet Silicone Lube 900 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 53, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'ergonomic-water-based-lube-669', 'Ergonomic Water-Based Lube 669', 'A premium water-based lube designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Ergonomic Water-Based Lube 669. Crafted from body-safe materials, this luxurious water-based lube features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-8', 165.99, 193.99, 
  '[{"id":"img-1-3250","url":"/images/products/premium_1.webp","alt":"Ergonomic Water-Based Lube 669 front view","isPrimary":true},{"id":"img-2-3437","url":"/images/products/premium_2.webp","alt":"Ergonomic Water-Based Lube 669 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 97, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'sensual-warming-lube-360', 'Sensual Warming Lube 360', 'A premium warming lube designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Sensual Warming Lube 360. Crafted from body-safe materials, this luxurious warming lube features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-8', 132.99, NULL, 
  '[{"id":"img-1-1104","url":"/images/products/premium_4.webp","alt":"Sensual Warming Lube 360 front view","isPrimary":true},{"id":"img-2-7959","url":"/images/products/premium_1.webp","alt":"Sensual Warming Lube 360 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 36, true, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'silicone-thong-set-637', 'Silicone Thong Set 637', 'A premium thong set designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Silicone Thong Set 637. Crafted from body-safe materials, this luxurious thong set features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-9', 57.99, NULL, 
  '[{"id":"img-1-1365","url":"/images/products/premium_1.webp","alt":"Silicone Thong Set 637 front view","isPrimary":true},{"id":"img-2-2702","url":"/images/products/premium_4.webp","alt":"Silicone Thong Set 637 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 17, false, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'luxury-stockings-164', 'Luxury Stockings 164', 'A premium stockings designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Luxury Stockings 164. Crafted from body-safe materials, this luxurious stockings features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-9', 138.99, NULL, 
  '[{"id":"img-1-5611","url":"/images/products/premium_4.webp","alt":"Luxury Stockings 164 front view","isPrimary":true},{"id":"img-2-9196","url":"/images/products/premium_2.webp","alt":"Luxury Stockings 164 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 32, true, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'discreet-stockings-805', 'Discreet Stockings 805', 'A premium stockings designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Discreet Stockings 805. Crafted from body-safe materials, this luxurious stockings features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-9', 55.99, 78.99000000000001, 
  '[{"id":"img-1-4813","url":"/images/products/premium_2.webp","alt":"Discreet Stockings 805 front view","isPrimary":true},{"id":"img-2-1116","url":"/images/products/premium_5.webp","alt":"Discreet Stockings 805 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 41, true, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'classic-bodysuit-900', 'Classic Bodysuit 900', 'A premium bodysuit designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Classic Bodysuit 900. Crafted from body-safe materials, this luxurious bodysuit features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-9', 161.99, NULL, 
  '[{"id":"img-1-3073","url":"/images/products/premium_5.webp","alt":"Classic Bodysuit 900 front view","isPrimary":true},{"id":"img-2-9513","url":"/images/products/premium_3.webp","alt":"Classic Bodysuit 900 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 49, false, false, true, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'velvet-lace-babydoll-949', 'Velvet Lace Babydoll 949', 'A premium lace babydoll designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Velvet Lace Babydoll 949. Crafted from body-safe materials, this luxurious lace babydoll features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-9', 81.99, 116.99, 
  '[{"id":"img-1-8285","url":"/images/products/premium_3.webp","alt":"Velvet Lace Babydoll 949 front view","isPrimary":true},{"id":"img-2-5813","url":"/images/products/premium_5.webp","alt":"Velvet Lace Babydoll 949 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 32, false, true, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'velvet-silk-robe-659', 'Velvet Silk Robe 659', 'A premium silk robe designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Velvet Silk Robe 659. Crafted from body-safe materials, this luxurious silk robe features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-9', 92.99, 122.99, 
  '[{"id":"img-1-3409","url":"/images/products/premium_5.webp","alt":"Velvet Silk Robe 659 front view","isPrimary":true},{"id":"img-2-1655","url":"/images/products/premium_1.webp","alt":"Velvet Silk Robe 659 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 18, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'luxury-gift-set-350', 'Luxury Gift Set 350', 'A premium gift set designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Luxury Gift Set 350. Crafted from body-safe materials, this luxurious gift set features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-10', 95.99, NULL, 
  '[{"id":"img-1-8423","url":"/images/products/premium_4.webp","alt":"Luxury Gift Set 350 front view","isPrimary":true},{"id":"img-2-8871","url":"/images/products/premium_1.webp","alt":"Luxury Gift Set 350 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 49, true, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'discreet-accessory-656', 'Discreet Accessory 656', 'A premium accessory designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Discreet Accessory 656. Crafted from body-safe materials, this luxurious accessory features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-10', 185.99, 232.99, 
  '[{"id":"img-1-1735","url":"/images/products/premium_4.webp","alt":"Discreet Accessory 656 front view","isPrimary":true},{"id":"img-2-9524","url":"/images/products/premium_3.webp","alt":"Discreet Accessory 656 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 100, false, false, true, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'elegant-essentials-kit-670', 'Elegant Essentials Kit 670', 'A premium essentials kit designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Elegant Essentials Kit 670. Crafted from body-safe materials, this luxurious essentials kit features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-10', 46.99, 74.99000000000001, 
  '[{"id":"img-1-4161","url":"/images/products/premium_4.webp","alt":"Elegant Essentials Kit 670 front view","isPrimary":true},{"id":"img-2-4030","url":"/images/products/premium_1.webp","alt":"Elegant Essentials Kit 670 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 32, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'intimate-massager-380', 'Intimate Massager 380', 'A premium massager designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Intimate Massager 380. Crafted from body-safe materials, this luxurious massager features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-10', 79.99, 96.99, 
  '[{"id":"img-1-5363","url":"/images/products/premium_3.webp","alt":"Intimate Massager 380 front view","isPrimary":true},{"id":"img-2-1333","url":"/images/products/premium_5.webp","alt":"Intimate Massager 380 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 24, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'premium-massager-631', 'Premium Massager 631', 'A premium massager designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Premium Massager 631. Crafted from body-safe materials, this luxurious massager features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-10', 108.99, 128.99, 
  '[{"id":"img-1-8258","url":"/images/products/premium_2.webp","alt":"Premium Massager 631 front view","isPrimary":true},{"id":"img-2-6621","url":"/images/products/premium_3.webp","alt":"Premium Massager 631 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 85, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'ergonomic-essentials-kit-668', 'Ergonomic Essentials Kit 668', 'A premium essentials kit designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Ergonomic Essentials Kit 668. Crafted from body-safe materials, this luxurious essentials kit features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-10', 155.99, NULL, 
  '[{"id":"img-1-9352","url":"/images/products/premium_5.webp","alt":"Ergonomic Essentials Kit 668 front view","isPrimary":true},{"id":"img-2-2925","url":"/images/products/premium_4.webp","alt":"Ergonomic Essentials Kit 668 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 93, true, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'ergonomic-essentials-kit-289', 'Ergonomic Essentials Kit 289', 'A premium essentials kit designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Ergonomic Essentials Kit 289. Crafted from body-safe materials, this luxurious essentials kit features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-11', 43.99, 61.99, 
  '[{"id":"img-1-4819","url":"/images/products/premium_4.webp","alt":"Ergonomic Essentials Kit 289 front view","isPrimary":true},{"id":"img-2-3253","url":"/images/products/premium_5.webp","alt":"Ergonomic Essentials Kit 289 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 21, true, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'elegant-stimulator-671', 'Elegant Stimulator 671', 'A premium stimulator designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Elegant Stimulator 671. Crafted from body-safe materials, this luxurious stimulator features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-11', 60.99, 75.99000000000001, 
  '[{"id":"img-1-4215","url":"/images/products/premium_1.webp","alt":"Elegant Stimulator 671 front view","isPrimary":true},{"id":"img-2-8114","url":"/images/products/premium_4.webp","alt":"Elegant Stimulator 671 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 41, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'discreet-gift-set-110', 'Discreet Gift Set 110', 'A premium gift set designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Discreet Gift Set 110. Crafted from body-safe materials, this luxurious gift set features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-11', 97.99, NULL, 
  '[{"id":"img-1-4381","url":"/images/products/premium_1.webp","alt":"Discreet Gift Set 110 front view","isPrimary":true},{"id":"img-2-8613","url":"/images/products/premium_4.webp","alt":"Discreet Gift Set 110 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 90, true, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'velvet-stimulator-928', 'Velvet Stimulator 928', 'A premium stimulator designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Velvet Stimulator 928. Crafted from body-safe materials, this luxurious stimulator features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-11', 162.99, NULL, 
  '[{"id":"img-1-2141","url":"/images/products/premium_1.webp","alt":"Velvet Stimulator 928 front view","isPrimary":true},{"id":"img-2-7591","url":"/images/products/premium_5.webp","alt":"Velvet Stimulator 928 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 95, false, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'classic-gift-set-386', 'Classic Gift Set 386', 'A premium gift set designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Classic Gift Set 386. Crafted from body-safe materials, this luxurious gift set features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-11', 36.99, 63.99, 
  '[{"id":"img-1-9158","url":"/images/products/premium_1.webp","alt":"Classic Gift Set 386 front view","isPrimary":true},{"id":"img-2-7287","url":"/images/products/premium_4.webp","alt":"Classic Gift Set 386 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 54, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'discreet-massager-601', 'Discreet Massager 601', 'A premium massager designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Discreet Massager 601. Crafted from body-safe materials, this luxurious massager features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-11', 62.99, NULL, 
  '[{"id":"img-1-9641","url":"/images/products/premium_2.webp","alt":"Discreet Massager 601 front view","isPrimary":true},{"id":"img-2-4840","url":"/images/products/premium_3.webp","alt":"Discreet Massager 601 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 19, true, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'ergonomic-accessory-802', 'Ergonomic Accessory 802', 'A premium accessory designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Ergonomic Accessory 802. Crafted from body-safe materials, this luxurious accessory features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-11', 172.99, 194.99, 
  '[{"id":"img-1-8964","url":"/images/products/premium_3.webp","alt":"Ergonomic Accessory 802 front view","isPrimary":true},{"id":"img-2-2946","url":"/images/products/premium_5.webp","alt":"Ergonomic Accessory 802 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 72, true, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'ergonomic-sleeve-385', 'Ergonomic Sleeve 385', 'A premium sleeve designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Ergonomic Sleeve 385. Crafted from body-safe materials, this luxurious sleeve features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-12', 136.99, 151.99, 
  '[{"id":"img-1-6311","url":"/images/products/premium_5.webp","alt":"Ergonomic Sleeve 385 front view","isPrimary":true},{"id":"img-2-5336","url":"/images/products/premium_2.webp","alt":"Ergonomic Sleeve 385 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 56, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'silicone-stroker-699', 'Silicone Stroker 699', 'A premium stroker designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Silicone Stroker 699. Crafted from body-safe materials, this luxurious stroker features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-12', 132.99, 151.99, 
  '[{"id":"img-1-7835","url":"/images/products/premium_5.webp","alt":"Silicone Stroker 699 front view","isPrimary":true},{"id":"img-2-1178","url":"/images/products/premium_4.webp","alt":"Silicone Stroker 699 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 76, false, false, true, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'elegant-masturbator-447', 'Elegant Masturbator 447', 'A premium masturbator designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Elegant Masturbator 447. Crafted from body-safe materials, this luxurious masturbator features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-12', 41.99, 85.99000000000001, 
  '[{"id":"img-1-2783","url":"/images/products/premium_1.webp","alt":"Elegant Masturbator 447 front view","isPrimary":true},{"id":"img-2-4444","url":"/images/products/premium_4.webp","alt":"Elegant Masturbator 447 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 89, false, true, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'intimate-prostate-massager-440', 'Intimate Prostate Massager 440', 'A premium prostate massager designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Intimate Prostate Massager 440. Crafted from body-safe materials, this luxurious prostate massager features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-12', 60.99, NULL, 
  '[{"id":"img-1-2377","url":"/images/products/premium_4.webp","alt":"Intimate Prostate Massager 440 front view","isPrimary":true},{"id":"img-2-3882","url":"/images/products/premium_2.webp","alt":"Intimate Prostate Massager 440 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 82, false, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'intimate-ring-968', 'Intimate Ring 968', 'A premium ring designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Intimate Ring 968. Crafted from body-safe materials, this luxurious ring features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-12', 32.99, NULL, 
  '[{"id":"img-1-1396","url":"/images/products/premium_3.webp","alt":"Intimate Ring 968 front view","isPrimary":true},{"id":"img-2-2667","url":"/images/products/premium_5.webp","alt":"Intimate Ring 968 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 54, false, false, true, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'intimate-sleeve-417', 'Intimate Sleeve 417', 'A premium sleeve designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Intimate Sleeve 417. Crafted from body-safe materials, this luxurious sleeve features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-12', 48.99, NULL, 
  '[{"id":"img-1-3124","url":"/images/products/premium_3.webp","alt":"Intimate Sleeve 417 front view","isPrimary":true},{"id":"img-2-6619","url":"/images/products/premium_1.webp","alt":"Intimate Sleeve 417 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 24, false, true, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'premium-ring-417', 'Premium Ring 417', 'A premium ring designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Premium Ring 417. Crafted from body-safe materials, this luxurious ring features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-12', 143.99, 186.99, 
  '[{"id":"img-1-2965","url":"/images/products/premium_2.webp","alt":"Premium Ring 417 front view","isPrimary":true},{"id":"img-2-1534","url":"/images/products/premium_1.webp","alt":"Premium Ring 417 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 18, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'premium-ring-959', 'Premium Ring 959', 'A premium ring designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Premium Ring 959. Crafted from body-safe materials, this luxurious ring features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-12', 58.99, NULL, 
  '[{"id":"img-1-7783","url":"/images/products/premium_4.webp","alt":"Premium Ring 959 front view","isPrimary":true},{"id":"img-2-8448","url":"/images/products/premium_2.webp","alt":"Premium Ring 959 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 70, false, false, true, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'ergonomic-wand-320', 'Ergonomic Wand 320', 'A premium wand designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Ergonomic Wand 320. Crafted from body-safe materials, this luxurious wand features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-13', 197.99, 236.99, 
  '[{"id":"img-1-9015","url":"/images/products/premium_1.webp","alt":"Ergonomic Wand 320 front view","isPrimary":true},{"id":"img-2-3074","url":"/images/products/premium_5.webp","alt":"Ergonomic Wand 320 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 56, false, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'discreet-rabbit-872', 'Discreet Rabbit 872', 'A premium rabbit designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Discreet Rabbit 872. Crafted from body-safe materials, this luxurious rabbit features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-13', 94.99, 105.99, 
  '[{"id":"img-1-3447","url":"/images/products/premium_2.webp","alt":"Discreet Rabbit 872 front view","isPrimary":true},{"id":"img-2-7856","url":"/images/products/premium_5.webp","alt":"Discreet Rabbit 872 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 32, true, false, true, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'discreet-g-spot-massager-989', 'Discreet G-Spot Massager 989', 'A premium g-spot massager designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Discreet G-Spot Massager 989. Crafted from body-safe materials, this luxurious g-spot massager features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-13', 22.99, 59.989999999999995, 
  '[{"id":"img-1-1764","url":"/images/products/premium_5.webp","alt":"Discreet G-Spot Massager 989 front view","isPrimary":true},{"id":"img-2-9510","url":"/images/products/premium_4.webp","alt":"Discreet G-Spot Massager 989 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 64, true, false, false, 
  true, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'luxury-wand-233', 'Luxury Wand 233', 'A premium wand designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Luxury Wand 233. Crafted from body-safe materials, this luxurious wand features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-13', 113.99, NULL, 
  '[{"id":"img-1-2099","url":"/images/products/premium_3.webp","alt":"Luxury Wand 233 front view","isPrimary":true},{"id":"img-2-5671","url":"/images/products/premium_4.webp","alt":"Luxury Wand 233 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 70, false, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'sensual-bullet-281', 'Sensual Bullet 281', 'A premium bullet designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Sensual Bullet 281. Crafted from body-safe materials, this luxurious bullet features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-13', 31.99, NULL, 
  '[{"id":"img-1-8205","url":"/images/products/premium_1.webp","alt":"Sensual Bullet 281 front view","isPrimary":true},{"id":"img-2-3928","url":"/images/products/premium_5.webp","alt":"Sensual Bullet 281 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 76, false, true, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'premium-rabbit-375', 'Premium Rabbit 375', 'A premium rabbit designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Premium Rabbit 375. Crafted from body-safe materials, this luxurious rabbit features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-13', 196.99, NULL, 
  '[{"id":"img-1-7712","url":"/images/products/premium_4.webp","alt":"Premium Rabbit 375 front view","isPrimary":true},{"id":"img-2-6453","url":"/images/products/premium_5.webp","alt":"Premium Rabbit 375 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 25, true, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'sensual-rabbit-435', 'Sensual Rabbit 435', 'A premium rabbit designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Sensual Rabbit 435. Crafted from body-safe materials, this luxurious rabbit features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-13', 24.99, NULL, 
  '[{"id":"img-1-6064","url":"/images/products/premium_4.webp","alt":"Sensual Rabbit 435 front view","isPrimary":true},{"id":"img-2-7716","url":"/images/products/premium_5.webp","alt":"Sensual Rabbit 435 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 26, false, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;

INSERT INTO public.products (
  slug, name, short_description, description, category_id, price, compare_at_price, 
  images, features, in_stock, stock_count, is_new, is_best_seller, is_featured, 
  is_on_sale, status, materials
) VALUES (
  'intimate-bullet-376', 'Intimate Bullet 376', 'A premium bullet designed for ultimate satisfaction.', 'Experience unparalleled pleasure with the Intimate Bullet 376. Crafted from body-safe materials, this luxurious bullet features a sleek, ergonomic design that perfectly contours to your body. Whether you''re exploring solo or with a partner, its powerful yet whisper-quiet operation guarantees a deeply satisfying experience. Fully waterproof for bath-time fun and easy cleaning, and USB rechargeable for continuous enjoyment.', 'cat-13', 167.99, NULL, 
  '[{"id":"img-1-9199","url":"/images/products/premium_3.webp","alt":"Intimate Bullet 376 front view","isPrimary":true},{"id":"img-2-7944","url":"/images/products/premium_5.webp","alt":"Intimate Bullet 376 side view","isPrimary":false}]'::jsonb, '[{"icon":"Shield","label":"100% Medical Grade Silicone","description":"Body safe and hypoallergenic."},{"icon":"Zap","label":"Whisper Quiet Operation","description":"Discreet use anywhere."},{"icon":"Droplet","label":"Fully Waterproof (IPX7)","description":"Safe for bath and shower use."},{"icon":"BatteryCharging","label":"USB Rechargeable","description":"Long lasting battery life."},{"icon":"Activity","label":"Multiple Vibration Modes","description":"Customizable intensity levels."}]'::jsonb, true, 93, false, false, false, 
  false, 'published', '["Medical Grade Silicone","ABS Plastic"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET 
  images = EXCLUDED.images,
  features = EXCLUDED.features;
