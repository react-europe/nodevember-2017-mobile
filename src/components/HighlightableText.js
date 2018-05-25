// Local implementation of 'react-native-highlight-words'
import React from 'react';
import {Text} from 'react-native';
import {findAll} from 'highlight-words-core';

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
}) {
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
