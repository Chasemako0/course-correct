import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function QuizScreen() {
  const navigation = useNavigation();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState('easy');
  const [category, setCategory] = useState('9'); // General Knowledge

  const categories = {
    '9': 'General Knowledge',
    '18': 'Computer Science',
    '21': 'Sports',
    '23': 'History',
    '17': 'Science & Nature'
  };

  const decodeHTMLEntities = (str) =>
    str.replace(/&quot;/g, '"')
       .replace(/&#039;/g, "'")
       .replace(/&amp;/g, '&')
       .replace(/&rsquo;/g, '’');

  const shuffleArray = (arr) =>
    arr.sort(() => Math.random() - 0.5);

  const fetchQuestions = async () => {
    setLoading(true);
    setQuestions([]);
    setScore(0);
    setCurrent(0);
    setSelected(null);
    setShowAnswer(false);

    try {
      const res = await fetch(`https://opentdb.com/api.php?amount=10&type=multiple&category=${category}&difficulty=${difficulty}`);
      const data = await res.json();

      const formatted = data.results.map(q => ({
        question: decodeHTMLEntities(q.question),
        correct: q.correct_answer,
        answers: shuffleArray([q.correct_answer, ...q.incorrect_answers].map(decodeHTMLEntities)),
      }));

      setQuestions(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (answer) => {
    setSelected(answer);
    setShowAnswer(true);
    if (answer === questions[current].correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setCurrent(prev => prev + 1);
    setSelected(null);
    setShowAnswer(false);
  };

  const handleStartQuiz = () => {
    fetchQuestions();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back-outline" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.heading}>QUIZ SECTION</Text>

        <Text style={styles.label}>Select Category</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={(val) => setCategory(val)}
          >
            {Object.entries(categories).map(([id, label]) => (
              <Picker.Item key={id} label={label} value={id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Select Difficulty</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={difficulty}
            onValueChange={(val) => setDifficulty(val)}
          >
            <Picker.Item label="Easy" value="easy" />
            <Picker.Item label="Medium" value="medium" />
            <Picker.Item label="Hard" value="hard" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.startBtn} onPress={handleStartQuiz}>
          <Text style={styles.startText}>Start Quiz</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (current >= questions.length) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back-outline" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.heading}>QUIZ SECTION</Text>
        <Text style={styles.title}>You've completed the quiz! 🎉</Text>
        <Text style={styles.score}>Your Score: {score} / {questions.length}</Text>
        <TouchableOpacity style={styles.startBtn} onPress={handleStartQuiz}>
          <Text style={styles.startText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQ = questions[current];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Icon name="arrow-back-outline" size={22} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.heading}>QUIZ SECTION</Text>

      <Text style={styles.title}>Question {current + 1}</Text>
      <Text style={styles.question}>{currentQ.question}</Text>

      {currentQ.answers.map((answer, index) => {
        const isCorrect = answer === currentQ.correct;
        const isSelected = selected === answer;

        let bgColor = '#fff';
        if (showAnswer) {
          if (isCorrect) bgColor = '#4ade80';
          else if (isSelected) bgColor = '#f87171';
        }

        return (
          <TouchableOpacity
            key={index}
            style={[styles.option, { backgroundColor: bgColor }]}
            onPress={() => handleSelect(answer)}
            disabled={showAnswer}
          >
            <Text style={styles.optionText}>{answer}</Text>
          </TouchableOpacity>
        );
      })}

      {showAnswer && (
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
    paddingTop: 60,
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
  heading: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1e3a8a',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1f2937',
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    color: '#1f2937',
  },
  option: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#1e293b',
  },
  nextBtn: {
    marginTop: 20,
    backgroundColor: '#1e3a8a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: '600',
  },
  startBtn: {
    backgroundColor: '#1e3a8a',
    padding: 14,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  startText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    color: '#374151',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  score: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10b981',
    marginTop: 10,
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
