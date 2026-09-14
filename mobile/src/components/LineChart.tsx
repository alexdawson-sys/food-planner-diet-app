import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { Text } from 'react-native-paper';

export function LineChart({ points, accent = '#0f766e' }: { points: { label: string; value: number }[]; accent?: string }) {
  const width = 300;
  const height = 150;
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);

  const graph = points.map((point, index) => {
    const x = (index / Math.max(1, points.length - 1)) * width;
    const y = height - ((point.value - min) / range) * (height - 16) - 8;
    return { ...point, x, y };
  });

  return (
    <View>
      <Svg width={width} height={height}>
        <Polyline points={graph.map((point) => `${point.x},${point.y}`).join(' ')} fill="none" stroke={accent} strokeWidth="4" />
        {graph.map((point) => (
          <Circle key={point.label} cx={point.x} cy={point.y} r="5" fill={accent} />
        ))}
      </Svg>
      <View style={styles.labels}>
        {points.map((point) => (
          <Text key={point.label} variant="labelSmall">{point.label}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
});
