import React from 'react';
import { useSelector } from 'react-redux';
import { getCompletedVariationsAndOpeningName } from '../../state/selectors'; // Adjust the import path as needed
import { TouchableOpacity, Text } from 'react-native'; // Adjust the import path as needed

const DebugView = ({ openingKey }) => {
  // Hook to get the name of the opening and completed variations info
  const { openingName, completedVariations } = useSelector(state =>
    getCompletedVariationsAndOpeningName(state, openingKey),
  );

  const handleShowCompleted = () => {
    const message =
      completedVariations.length > 0
        ? `Completed variations for ${openingName}: ${completedVariations
            .map(v => v.name)
            .join(', ')}`
        : `No completed variations for ${openingName}.`;

    alert(message);
  };

  return (
    <TouchableOpacity onPress={handleShowCompleted}>
      <Text>Show Completed Variations</Text>
    </TouchableOpacity>
  );
};

export default DebugView;
