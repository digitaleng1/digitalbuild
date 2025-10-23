import React, { useState } from 'react';
import type { ListTaskItem } from '../types';

export default function useTask(task: ListTaskItem) {
	const [completed, setCompleted] = useState<boolean>(task.stage === 'Done');

	const [editorState, setEditorState] = useState<string>(`
  <h3>This is a simple editable area.</h3>
  <p><br></p>
  <ul>
      <li>
          Select a text to reveal the toolbar.
      </li>
      <li>
          Edit rich document on-the-fly, so elastic!
      </li>
  </ul>
  <p><br></p>
  <p>
      End of simple area
  </p>
  `);

	/**
	 * On editor body change
	 */
	const onEditorStateChange = (editorStates: string) => {
		setEditorState(editorStates);
	};

	/*
	 * mark completd on selected task
	 */
	const markCompleted = (e: React.ChangeEvent<HTMLInputElement>, callback?: (task: ListTaskItem) => void) => {
		setCompleted(e.target.checked);
		if (callback) callback(task);
	};

	return {
		completed,
		editorState,
		onEditorStateChange,
		markCompleted,
	};
}
