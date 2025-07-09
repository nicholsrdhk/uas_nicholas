// app/home.tsx

import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  FlatList,
  ActivityIndicator,
  Keyboard,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import MovieCard from "@/components/MovieCard";

const COLORS = {
  background: "#121212",
  accent: "#009B77",
  textTitle: "#F5F5F5",
  textDesc: "#A8A8A8",
  uiSecondary: "#222222",
  uiLight: "#3A3A3A",
};
const API_KEY = "b45dad4f";

type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="film-outline" size={80} color={COLORS.uiSecondary} />
    <Text style={styles.emptyTitle}>Temukan Film Favoritmu</Text>
    <Text style={styles.emptySubtitle}>
      Mulai cari judul film, serial, atau episode di atas.
    </Text>
  </View>
);

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setMovies([]);
      setError(null);
      setTotalResults(0);
      setPage(1);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    Keyboard.dismiss();
    if (searchQuery.trim() === "") return;
    
    setPage(1);
    setIsLoading(true);
    setError(null);
    setMovies([]);

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}&page=1`
      );
      const data = await response.json();
      if (data.Response === "True") {
        setMovies(data.Search);
        setTotalResults(parseInt(data.totalResults, 10));
      } else {
        setError(data.Error || "Film tidak ditemukan.");
        setTotalResults(0);
      }
    } catch (err) {
      setError("Gagal terhubung ke server. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || movies.length >= totalResults) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}&page=${nextPage}`
      );
      const data = await response.json();
      if (data.Response === "True") {
        setMovies((prevMovies) => [...prevMovies, ...data.Search]);
        setPage(nextPage);
      }
    } catch (err) {
      console.error("Gagal memuat lebih banyak:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const filteredMovies = useMemo(() => {
    if (!filterType) {
      return movies; 
    }
    return movies.filter((movie) => movie.Type === filterType);
  }, [movies, filterType]);

  const renderFooter = () => {
    if (isLoadingMore) {
      return <ActivityIndicator size="small" color={COLORS.accent} style={{ marginVertical: 20 }} />;
    }
    if (movies.length > 0 && movies.length < totalResults) {
      return (
        <Pressable style={styles.loadMoreButton} onPress={handleLoadMore}>
          <Text style={styles.loadMoreButtonText}>Muat Lebih Banyak</Text>
        </Pressable>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.background, COLORS.accent]}
        style={styles.gradient}
        locations={[0.3, 1.0]}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.headerContainer}>
          <Text style={styles.logoText}>
            Sin<Text style={{ color: COLORS.accent }}>é</Text>Log
          </Text>
        </View>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={COLORS.textDesc} style={styles.searchIcon}/>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for movies, series..."
            placeholderTextColor={COLORS.textDesc}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>

        {movies.length > 0 && (
            <View style={styles.filterContainer}>
                <Pressable onPress={() => setFilterType(null)} style={[styles.filterButton, !filterType && styles.filterButtonActive]}>
                    <Text style={styles.filterButtonText}>Semua</Text>
                </Pressable>
                <Pressable onPress={() => setFilterType('movie')} style={[styles.filterButton, filterType === 'movie' && styles.filterButtonActive]}>
                    <Text style={styles.filterButtonText}>Movie</Text>
                </Pressable>
                <Pressable onPress={() => setFilterType('series')} style={[styles.filterButton, filterType === 'series' && styles.filterButtonActive]}>
                    <Text style={styles.filterButtonText}>Series</Text>
                </Pressable>
            </View>
        )}

        <View style={{ flex: 1 }}>
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.accent} style={{ flex: 1 }} />
          ) : error ? (
            <View style={styles.emptyContainer}>
              <Feather name="frown" size={80} color={COLORS.uiSecondary} />
              <Text style={styles.emptyTitle}>{error}</Text>
            </View>
          ) : movies.length > 0 ? (
            <FlatList
              data={filteredMovies}
              keyExtractor={(item, index) => item.imdbID + index}
              renderItem={({ item }) => (
                <MovieCard
                  id={item.imdbID}
                  poster={item.Poster}
                  title={item.Title}
                  year={item.Year}
                  type={item.Type}
                />
              )}
              contentContainerStyle={{ paddingBottom: 24 }}
              keyboardShouldPersistTaps="always"
              ListFooterComponent={renderFooter} 
            />
          ) : (
            <EmptyState />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  gradient: { flex: 1, paddingHorizontal: 16 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 10,
    height: 40,
  },
  logoText: {
    fontFamily: "PlusJakartaSans",
    fontWeight: "bold",
    fontSize: 24,
    color: COLORS.textTitle,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 245, 245, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    height: 48,
    color: COLORS.textTitle,
    fontFamily: "PlusJakartaSans",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontFamily: "PlusJakartaSans",
    fontWeight: "bold",
    fontSize: 20,
    color: COLORS.textTitle,
    textAlign: "center",
    marginTop: 16,
  },
  emptySubtitle: {
    fontFamily: "PlusJakartaSans",
    fontSize: 14,
    color: COLORS.textDesc,
    marginTop: 8,
    textAlign: "center",
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.uiLight,
    marginHorizontal: 5,
  },
  filterButtonActive: {
    backgroundColor: COLORS.accent,
  },
  filterButtonText: {
    color: COLORS.textTitle,
    fontFamily: 'PlusJakartaSans',
    fontWeight: '600',
  },
  loadMoreButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  loadMoreButtonText: {
    color: COLORS.textTitle,
    fontFamily: 'PlusJakartaSans',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomePage;