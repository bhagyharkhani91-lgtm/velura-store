-- Backfill existing product ratings from reviews
UPDATE public.products p
SET 
  rating = COALESCE(
    (SELECT ROUND(AVG(r.rating)::numeric, 1) FROM public.product_reviews r WHERE r.product_id = p.id AND r.status = 'approved'),
    0
  ),
  review_count = (
    SELECT COUNT(*) FROM public.product_reviews r WHERE r.product_id = p.id AND r.status = 'approved'
  ),
  updated_at = now();

-- Trigger function to keep product rating and review count in sync
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_product_id text;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_product_id := OLD.product_id;
  ELSE
    target_product_id := NEW.product_id;
  END IF;

  UPDATE public.products
  SET 
    rating = COALESCE(
      (SELECT ROUND(AVG(rating)::numeric, 1) FROM public.product_reviews WHERE product_id = target_product_id AND status = 'approved'),
      0
    ),
    review_count = (
      SELECT COUNT(*) FROM public.product_reviews WHERE product_id = target_product_id AND status = 'approved'
    ),
    updated_at = now()
  WHERE id = target_product_id;

  IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_product_rating ON public.product_reviews;
CREATE TRIGGER trg_update_product_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_product_rating();
