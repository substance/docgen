export default {
  // This will be used to create links to source files within the API docs
  repository: "https://github.com/substance/docgen",
  sha: '0000',
  content: [
    { type: "cover", title: "Documentation Generator", src: "example/cover.md" },
    { type: "chapter", level: 1, title: "Getting Started", src: "example/getting-started.md" },
    { type: "chapter", level: 1, title: "Public API" },
      { type: "api", pattern: "example/model/**/*.js" },
      { type: "api", pattern: "example/ui/**/*.js" },
  ]
}
