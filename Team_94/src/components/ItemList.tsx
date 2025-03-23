import React from 'react';
import { ItemCard } from './ItemCard';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Item = Database['public']['Tables']['items']['Row'] & {
  shops: Database['public']['Tables']['shops']['Row'];
};

interface ItemListProps {
  category: string | null;
  onAddToCart: (item: Item) => void;
}

export function ItemList({ category: propCategory, onAddToCart }: ItemListProps) {
  const category = propCategory;
  
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchItems() {
      try {
        let query = supabase
          .from('items')
          .select(`
            *,
            shops (
              name,
              location
            )
          `);

        if (category) {
          query = query.eq('category', category);
        }

        const { data, error: err } = await query;

        if (err) throw err;
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch items');
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
}