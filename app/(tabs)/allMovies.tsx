import FilmCard from "@/components/filmCard";
import SectionHeader from "@/components/SectionHeader";
import { commonStyles } from "@/styles/CommonStyles";
import type { Film } from "@/types/filmTypes";
import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useAppData } from "../../context/AppDataContext";

export default function AllFilmsScreen() {
  const { allFilms, myFavorites, addFavorite, removeFavorite, loading } =
    useAppData();

  const toggleFavorite = useCallback(
    async (film: Film) => {
      const isFav = myFavorites.includes(film.id);
      if (isFav) {
        await removeFavorite(film.id);
      } else {
        await addFavorite({
          id: film.id,
          title: film.title,
          posterUrl: film.posterUrl ?? undefined,
        });
        if (Platform.OS !== "web") Haptics.selectionAsync();
      }
    },
    [myFavorites, addFavorite, removeFavorite]
  );

  if (loading) {
    return (
      <View style={[commonStyles.center]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={[commonStyles.container]}>
      <FlatList
      ListHeaderComponent={
      <View style={commonStyles.headerBlock}>
      <SectionHeader
        title="DOX:FILMS"
        subtitle="All data is delicately hand-crafted by tired student on the train between vejle and copenhagen"
      />
      </View>
      }
        data={allFilms}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[
          styles.list,
          { paddingTop: 24 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <FilmCard
            film={item}
            isFavorite={myFavorites.includes(item.id)}
            onToggleFavorite={toggleFavorite}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
