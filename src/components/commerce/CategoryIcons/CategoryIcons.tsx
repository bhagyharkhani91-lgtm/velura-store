import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../layout/Container/Container';
import { useCategoryStore } from '../../../stores/categoryStore';
import './CategoryIcons.css';

import {
  Activity,
  Heart,
  Zap,
  Smile,
  Shield,
  Sun,
  Moon,
  Droplet,
  Flame,
  Star,
  Package
} from 'lucide-react';

// Helper to assign a relevant icon based on category name/slug
const getCategoryIcon = (slug: string) => {
  const s = slug.toLowerCase();
  if (s.includes('masturbator')) return <Activity size={32} />;
  if (s.includes('doll')) return <Heart size={32} />;
  if (s.includes('vibrator')) return <Zap size={32} />;
  if (s.includes('dildo')) return <Smile size={32} />;
  if (s.includes('sleeve')) return <Shield size={32} />;
  if (s.includes('ring')) return <Sun size={32} />;
  if (s.includes('anal')) return <Moon size={32} />;
  if (s.includes('plug')) return <Flame size={32} />;
  if (s.includes('bdsm')) return <Star size={32} />;
  if (s.includes('lubricant') || s.includes('lube')) return <Droplet size={32} />;
  return <Package size={32} />; // Fallback icon
};

export function CategoryIcons() {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (!categories || categories.length === 0) return null;

  return (
    <section className="category-icons-section">
      <Container>
        <div className="category-icons-grid">
          {categories.map((cat) => (
            <Link to={`/categories/${cat.slug}`} key={cat.id} className="category-icon-card">
              <div className="category-icon-box">
                {getCategoryIcon(cat.slug)}
              </div>
              <span className="category-icon-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
