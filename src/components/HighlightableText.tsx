// Local implementation of 'react-native-highlight-words'
import {findAll} from 'highlight-words-core';
import React from 'react';
import {Text, ViewStyle, StyleProp, TextStyle} from 'react-native';

type Props = {
  TextComponent: React.ComponentType<any>;
  autoEscape?: boolean;
  highlightStyle: StyleProp<TextStyle>;
  searchWords: string[];
  textToHighlight: string;
  sanitize?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Highlights all occurrences of search terms (searchText) within a string (textToHighlight).
 * This function returns an array of strings and <Text> elements (wrapping highlighted words).
 */
export default function Highlighter({
  TextComponent,
  autoEscape,
  highlightStyle,
  searchWords,
  textToHighlight,
  sanitize,
  style,
  ...props
}: Props) {
  const chunks = findAll({
    textToHighlight,
    searchWords,
    sanitize,
    autoEscape,
  });

  return (
    <TextComponent style={style} {...props}>
      {chunks.map((chunk, index) => {
        const text = textToHighlight.substr(
          chunk.start,
          chunk.end - chunk.start
        );

        return !chunk.highlight ? (
          text
        ) : (
          <Text key={index} style={chunk.highlight && highlightStyle}>
            {text}
          </Text>
        );
      })}
    </TextComponent>
  );
}
