import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, ActivityIndicator, Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function SearchScreen() {
  const navigation = useNavigation();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalHits, setTotalHits] = useState(0);

  const fetchResults = async (newOffset = 0) => {
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);
    setOffset(newOffset);

    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&sroffset=${newOffset}&srsearch=${encodeURIComponent(query)}`
      );

      const json = await response.json();
      setResults(json.query.search);
      setTotalHits(json.query.searchinfo.totalhits);
    } catch (error) {
      console.error(error);
      setResults([{ title: 'Error', snippet: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const openArticle = (title) => {
    const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
    Linking.openURL(url);
  };

  const hasNext = offset + 10 < totalHits;
  const hasPrev = offset > 0;

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Icon name="arrow-back-outline" size={22} color="#fff" />
      </TouchableOpacity>

      <View style={styles.innerContent}>
        <Text style={styles.title}>Wikipedia Search</Text>

        <TextInput
          style={styles.input}
          placeholder="Search Wikipedia..."
          value={query}
          onChangeText={setQuery}
        />

        <TouchableOpacity style={styles.button} onPress={() => fetchResults(0)}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="small" color="#1e3a8a" style={{ marginTop: 12 }} />}

        <ScrollView style={styles.resultContainer} contentContainerStyle={{ paddingBottom: 20 }}>
          {results.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => openArticle(item.title)} style={styles.resultItem}>
              <Text style={styles.resultTitle}>{item.title}</Text>
              <Text style={styles.resultSnippet}>{item.snippet.replace(/<[^>]+>/g, '')}</Text>
              <Text style={styles.link}>Tap to open article →</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Pagination placed outside the scroll view */}
      {(hasNext || hasPrev) && (
        <View style={styles.pagination}>
          {hasPrev && (
            <TouchableOpacity onPress={() => fetchResults(offset - 10)} style={styles.pageButton}>
              <Text style={styles.pageText}>← Previous</Text>
            </TouchableOpacity>
          )}
          {hasNext && (
            <TouchableOpacity onPress={() => fetchResults(offset + 10)} style={styles.pageButton}>
              <Text style={styles.pageText}>Next →</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 50,
  },
  backBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: '#1e3a8a',
    padding: 8,
    borderRadius: 30,
  },
  innerContent: {
    marginTop: 40,
    paddingHorizontal: 20,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    color: '#1e3a8a',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    borderColor: '#d1d5db',
    borderWidth: 1,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1e3a8a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  resultContainer: {
    flex: 1,
  },
  resultItem: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#1f2937',
  },
  resultSnippet: {
    fontSize: 14,
    color: '#4b5563',
  },
  link: {
    fontSize: 13,
    color: '#1e40af',
    marginTop: 6,
    fontStyle: 'italic',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  pageButton: {
    backgroundColor: '#1e3a8a',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  pageText: {
    color: '#fff',
    fontWeight: '600',
  },
});
