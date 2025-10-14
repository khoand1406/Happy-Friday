import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { getSearchResult } from "../services/search.service";
import MainLayout from "../layout/MainLayout";

interface SearchResult {
  type: string;
  id: string;
  title: string;
  snippet: string;
}

export default function SearchPage() {
  const location = useLocation();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState<Record<string, number>>({
    project: 5,
    event: 5,
    user: 5,
  });

  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await getSearchResult(query);
        setResults(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

 
  const grouped = results.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const typeLabels: Record<string, string> = {
    project: "🧩 Projects",
    event: "📅 Events",
    user: "👤 Users",
  };

  const handleShowMore = (type: string) => {
    setVisibleCount((prev) => ({
      ...prev,
      [type]: prev[type] + 5,
    }));
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  if (!results.length)
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6">
          Not found search result for “{query}”
        </Typography>
      </Box>
    );

  return (
    <MainLayout>
      <Box>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Search result for  “{query}”
        </Typography>

        <Grid container spacing={3}>
          {Object.keys(grouped).map((type) => {
            const items = grouped[type];
            const showMore = items.length > visibleCount[type];

            return (
              <Grid size={{ xs: 12, md: 4 }} key={type}>
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: 3,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                    p: 2,
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 2, display: "flex", alignItems: "center" }}
                  >
                    {typeLabels[type] || type} ({items.length})
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  {items.slice(0, visibleCount[type]).map((item) => (
                    <Card
                      key={item.id}
                      sx={{
                        mb: 2,
                        borderRadius: 2,
                        boxShadow: "none",
                        border: "1px solid #e5e7eb",
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f9fafb" },
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {item.snippet || "Không có mô tả"}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}

                  {showMore && (
                    <Button
                      fullWidth
                      variant="text"
                      sx={{ mt: 1, textTransform: "none", color: "#1976d2" }}
                      onClick={() => handleShowMore(type)}
                    >
                      View More
                    </Button>
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </MainLayout>
  );
}
