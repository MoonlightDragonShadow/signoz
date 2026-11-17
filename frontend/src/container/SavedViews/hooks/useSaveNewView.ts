import useConsoleTranslation from 'hooks/useConsoleTranslation';
import { useCallback } from 'react';
import { toast } from '@signozhq/ui/sonner';

import { SAVED_VIEW_TOAST_POSITION } from '../constants';
import { SavedViewCreatedFrom } from '../events';
import { UseSavedViewActionsResult } from '../types';

export function useSaveNewView(
	createView: UseSavedViewActionsResult['createView'],
): (displayName: string, from: SavedViewCreatedFrom) => Promise<boolean> {
	const translateToast = useConsoleTranslation();
	return useCallback(
		async (displayName: string, from: SavedViewCreatedFrom): Promise<boolean> => {
			if (!(await createView(displayName, from))) {
				return false;
			}
			toast.success(translateToast('View created'), {
				position: SAVED_VIEW_TOAST_POSITION,
			});
			return true;
		},
		[translateToast, createView],
	);
}
