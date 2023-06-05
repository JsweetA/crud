import { computed } from 'vue';
import { useAppStore } from '@/store/app/app';

const appStore = useAppStore();
export default function useChartOption(sourceOption) {
  const chartOption = computed(() => {
    return sourceOption(appStore.settings.themes === 'dark');
  });
  return {
    chartOption,
  };
}
