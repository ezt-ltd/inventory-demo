import {useSnackbar, VariantType} from "notistack";

export const useNotify = (initialState?: {}) => {
	const { enqueueSnackbar } = useSnackbar();

	const showNotify = (message?: string, variant?: VariantType) => {
		enqueueSnackbar(message || 'MasterPage', { variant: variant || "default" });
	}

	return {showNotify}
}