import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Eye } from "lucide-react";

const VisitorCounter = () => {
  const [count, setCount] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    const increment = async () => {
      const { data, error } = await supabase.rpc("increment_page_view", {
        p_path: location.pathname,
      });
      if (!error && data !== null) {
        setCount(data);
      }
    };
    increment();
  }, [location.pathname]);

  if (count === null) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
      <Eye className="h-4 w-4" />
      <span>{count.toLocaleString()} page views</span>
    </div>
  );
};

export default VisitorCounter;
