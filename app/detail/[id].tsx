// app/detail/[id].tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const COLORS = {
  background: "#121212",
  accent: "#009B77",
  textTitle: "#F5F5F5",
  textDesc: "#A8A8A8",
  uiSecondary: "#222222",
  uiLight: "#3A3A3A",
  star: "#F5C518",
  rottenTomatoes: "#FA3A15",
  metacritic: "#6c3",
};
const API_KEY = "b45dad4f";

type MovieDetail = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  BoxOffice: string;
  Production: string;
  Website: string;
};

type InfoPillProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  text: string;
};

const InfoPill = ({ icon, text }: InfoPillProps) => (
  <View style={styles.infoPill}>
    <Ionicons name={icon} size={14} color={COLORS.textDesc} />
    <Text style={styles.infoPillText}>{text}</Text>
  </View>
);

const DetailPage = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlotExpanded, setIsPlotExpanded] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
        );
        const data = await response.json();
        if (data.Response === "True") {
          setMovie(data);
        } else {
          setError(data.Error);
        }
      } catch (err) {
        setError("Gagal memuat detail film.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error || "Film tidak ditemukan."}</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  const imdbRating =
    movie.Ratings.find((r) => r.Source === "Internet Movie Database")?.Value ||
    `${movie.imdbRating}/10`;
  const rottenTomatoesRating = movie.Ratings.find(
    (r) => r.Source === "Rotten Tomatoes"
  )?.Value;

  const plotIsLong = movie.Plot.length > 150;
  const shortPlot = plotIsLong ? `${movie.Plot.substring(0, 150)}` : movie.Plot;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backIcon}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {movie.Title}
          </Text>
        </View>

        <Image
          source={{ uri: movie.Poster }}
          style={styles.posterBackground}
          blurRadius={10}
        />
        <LinearGradient
          colors={["transparent", COLORS.background]}
          style={styles.posterGradient}
        />

        <View style={styles.contentContainer}>
          <Image source={{ uri: movie.Poster }} style={styles.posterFront} />

          <Text style={styles.title}>{movie.Title}</Text>
          <Text style={styles.metaInfo}>{`${
            movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)
          } • ${movie.Rated} • Tahun ${movie.Year} • ${movie.Runtime}`}</Text>

          <View style={styles.infoPillContainer}>
            <InfoPill icon="globe-outline" text={movie.Country.split(",")[0]} />
            <InfoPill
              icon="language-outline"
              text={movie.Language.split(",")[0]}
            />
          </View>

          <View style={styles.genreContainer}>
            {movie.Genre.split(", ").map((g) => (
              <Text key={g} style={styles.genreTag}>
                {g}
              </Text>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Sinopsis</Text>
          <Text style={styles.plot}>
            {isPlotExpanded ? movie.Plot : shortPlot}
            {plotIsLong && !isPlotExpanded && (
              <Text 
                style={styles.readMoreText} 
                onPress={() => setIsPlotExpanded(true)}>
                ...selengkapnya
              </Text>
            )}
            {plotIsLong && isPlotExpanded && (
              <Text 
                style={styles.readMoreText} 
                onPress={() => setIsPlotExpanded(false)}>
                {' '}...lebih sedikit
              </Text>
            )}
          </Text>

          <Text style={styles.sectionTitle}>Kredit</Text>
          <Text style={styles.creditText}>
            <Text style={{ fontWeight: "bold" }}>Sutradara:</Text>{" "}
            {movie.Director}
          </Text>
          <Text style={styles.creditText}>
            <Text style={{ fontWeight: "bold" }}>Penulis:</Text> {movie.Writer}
          </Text>
          <Text style={styles.creditText}>
            <Text style={{ fontWeight: "bold" }}>Aktor:</Text> {movie.Actors}
          </Text>

          <Text style={styles.sectionTitle}>Rating</Text>
          <View style={styles.ratingsContainer}>
            {imdbRating && (
              <View style={styles.ratingBox}>
                <Feather name="star" size={24} color={COLORS.star} />
                <Text style={styles.ratingValue}>
                  {imdbRating.split("/")[0]}
                </Text>
                <Text style={styles.ratingSource}>IMDb</Text>
                <Text style={styles.ratingVotes}>{movie.imdbVotes} votes</Text>
              </View>
            )}
            {rottenTomatoesRating && (
              <View style={styles.ratingBox}>
                <MaterialCommunityIcons
                  name="fruit-cherries"
                  size={24}
                  color={COLORS.rottenTomatoes}
                />
                <Text style={styles.ratingValue}>{rottenTomatoesRating}</Text>
                <Text style={styles.ratingSource}>Rotten Tomatoes</Text>
              </View>
            )}
            {movie.Metascore !== "N/A" && (
              <View style={styles.ratingBox}>
                <MaterialCommunityIcons
                  name="star-four-points-outline"
                  size={24}
                  color={COLORS.metacritic}
                />
                <Text style={styles.ratingValue}>{movie.Metascore}</Text>
                <Text style={styles.ratingSource}>Metascore</Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Penghargaan</Text>
          <View style={styles.awardsContainer}>
            <Ionicons name="trophy-outline" size={18} color={COLORS.star} />
            <Text style={styles.awardsText}>{movie.Awards}</Text>
          </View>

          <Text style={styles.sectionTitle}>Informasi Tambahan</Text>
          <View style={styles.infoGrid}>
            {movie.BoxOffice !== "N/A" && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Box Office</Text>
                <Text style={styles.infoValue}>{movie.BoxOffice}</Text>
              </View>
            )}
            {movie.Production !== "N/A" && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Produksi</Text>
                <Text style={styles.infoValue}>{movie.Production}</Text>
              </View>
            )}
            {movie.Website !== "N/A" && (
              <Pressable
                onPress={() => Linking.openURL(movie.Website)}
                style={styles.websiteButton}
              >
                <Feather name="external-link" size={16} color={COLORS.accent} />
                <Text style={styles.websiteButtonText}>Kunjungi Situs Web</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { justifyContent: "center", alignItems: "center" },
  errorText: {
    color: COLORS.textTitle,
    fontSize: 18,
    fontFamily: "PlusJakartaSans",
  },
  backButton: {
    color: COLORS.accent,
    fontSize: 16,
    marginTop: 16,
    fontFamily: "PlusJakartaSans",
  },
  header: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    flex: 1,
    color: COLORS.textTitle,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    fontFamily: "PlusJakartaSans",
  },
  posterBackground: { width: "100%", height: 300, position: "absolute" },
  posterGradient: { position: "absolute", width: "100%", height: 300 },
  contentContainer: {
    paddingTop: 200,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  posterFront: {
    width: 140,
    height: 210,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.uiLight,
  },
  title: {
    color: COLORS.textTitle,
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "PlusJakartaSans",
  },
  metaInfo: {
    color: COLORS.textDesc,
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
    fontFamily: "PlusJakartaSans",
  },
  infoPillContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  infoPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.uiSecondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginHorizontal: 4,
  },
  infoPillText: {
    color: COLORS.textDesc,
    fontSize: 12,
    marginLeft: 5,
    fontFamily: "PlusJakartaSans",
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 16,
  },
  genreTag: {
    backgroundColor: COLORS.uiLight,
    color: COLORS.textTitle,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 4,
    fontSize: 12,
    fontFamily: "PlusJakartaSans",
  },
  sectionTitle: {
    color: COLORS.accent,
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
    fontFamily: "PlusJakartaSans",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.uiLight,
    paddingBottom: 8,
  },
  plot: {
    color: COLORS.textDesc,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "PlusJakartaSans",
  },
  creditText: {
    color: COLORS.textDesc,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "PlusJakartaSans",
  },
  ratingsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratingBox: {
    backgroundColor: COLORS.uiSecondary,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    width: "32%",
    minHeight: 120,
    justifyContent: "center",
  },
  ratingValue: {
    color: COLORS.textTitle,
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
    fontFamily: "PlusJakartaSans",
  },
  ratingSource: {
    color: COLORS.textDesc,
    fontSize: 12,
    marginTop: 2,
    fontFamily: "PlusJakartaSans",
    textAlign: "center",
  },
  ratingVotes: {
    color: COLORS.textDesc,
    fontSize: 10,
    fontFamily: "PlusJakartaSans",
  },
  awardsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.uiSecondary,
    padding: 12,
    borderRadius: 8,
  },
  awardsText: {
    color: COLORS.star,
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
    fontFamily: "PlusJakartaSans",
  },
  infoGrid: {
    backgroundColor: COLORS.uiSecondary,
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.uiLight,
  },
  infoLabel: {
    color: COLORS.textDesc,
    fontSize: 14,
    fontFamily: "PlusJakartaSans",
  },
  infoValue: {
    color: COLORS.textTitle,
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "PlusJakartaSans",
  },
  websiteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  websiteButtonText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
    fontFamily: "PlusJakartaSans",
  },
  readMoreText: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
});

export default DetailPage;