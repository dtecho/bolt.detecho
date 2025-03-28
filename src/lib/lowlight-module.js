// Mock module for lowlight
export default {
  highlight: () => ({
    value: "",
    language: null,
    relevance: 0,
    illegal: false,
    top: null,
    children: [],
  }),
};

export const highlight = () => ({
  value: "",
  language: null,
  relevance: 0,
  illegal: false,
  top: null,
  children: [],
});

export const listLanguages = () => [];
