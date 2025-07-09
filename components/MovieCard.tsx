// components/MovieCard.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

// Palet Warna
const COLORS = {
    textTitle: '#F5F5F5',
    textDesc: '#A8A8A8',
    uiSecondary: '#222222',
    uiLight: '#3A3A3A',
    accent: "#009B77"
};

// Tipe data untuk prop, kita tambahkan 'type'
type MovieCardProps = {
    id: string;
    poster: string;
    title: string;
    year: string;
    type: string;
};

const MovieCard = ({ id, poster, title, year, type }: MovieCardProps) => {
    const router = useRouter();

    const posterUri = poster === 'N/A' ? 'https://via.placeholder.com/100x150.png?text=No+Image' : poster;

    // Mengubah huruf pertama type menjadi kapital
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

    return (
        // Seluruh kartu bisa di-klik untuk navigasi
        <Pressable onPress={() => router.push(`/detail/${id}`)} style={styles.container}>
            {/* Kiri: Poster Film */}
            <Image source={{ uri: posterUri }} style={styles.poster} />

            {/* Kanan: Info Film */}
            <View style={styles.infoContainer}>
                <View style={styles.topRow}>
                    <Text style={styles.title} numberOfLines={2}>{title}</Text>
                    <View style={styles.typeTag}>
                        <Text style={styles.typeText}>{formattedType}</Text>
                    </View>
                </View>

                <Text style={styles.year}>Tahun {year}</Text>

                {/* Tombol detail hanya untuk visual, fungsionalitas ada di container */}
                <View style={styles.detailButton}>
                    <Text style={styles.detailButtonText}>Detail</Text>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: COLORS.uiSecondary,
        borderRadius: 12,
        marginVertical: 8,
        overflow: 'hidden',
    },
    poster: {
        width: 100,
        height: 150,
        backgroundColor: '#333',
    },
    infoContainer: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        flex: 1, // Agar title bisa wrap jika panjang
        fontFamily: 'PlusJakartaSans',
        fontWeight: 'bold',
        color: COLORS.textTitle,
        fontSize: 16,
        marginRight: 8,
    },
    typeTag: {
        backgroundColor: COLORS.uiLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeText: {
        fontFamily: 'PlusJakartaSans',
        color: COLORS.textDesc,
        fontSize: 10,
        fontWeight: '600',
    },
    year: {
        fontFamily: 'PlusJakartaSans',
        color: COLORS.textDesc,
        fontSize: 12,
        marginTop: 10,
    },
    detailButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 'auto', // Mendorong tombol ke bawah
    },
    detailButtonText: {
        fontFamily: 'PlusJakartaSans',
        color: COLORS.textTitle,
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default MovieCard;