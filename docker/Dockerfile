# Static site only: no source tree, evidence documents or build credentials.
FROM nginxinc/nginx-unprivileged@sha256:f5116ed4606f3eb015dd4a8e28cb9b351476dc0ad4bc6e9f93b19cec130cdf03

ARG VCS_REF=unknown
LABEL org.opencontainers.image.title="Statick Developer Portfolio" \
      org.opencontainers.image.version="3.0" \
      org.opencontainers.image.source="https://github.com/statick88/statick88.github.io" \
      org.opencontainers.image.revision="${VCS_REF}"

USER root
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html/
# Reject build:quick artifacts: a release includes the no-JS CV and exports.
# Reuse the build's generated policy instead of maintaining a second CSP.
RUN test -s /usr/share/nginx/html/exports/cv-data.json \
    && grep -q 'class="cv-fallback"' /usr/share/nginx/html/index.html \
    && awk '/^  [A-Za-z-]+:/ { \
      line = substr($0, 3); colon = index(line, ":"); \
      name = substr(line, 1, colon - 1); value = substr(line, colon + 2); \
      gsub(/\\\\/, "\\\\\\\\", value); gsub(/"/, "\\\\\"", value); \
      printf "add_header %s \"%s\" always;\n", name, value; \
    }' /usr/share/nginx/html/_headers > /etc/nginx/security-headers.conf \
    && test -s /etc/nginx/security-headers.conf \
    && rm /usr/share/nginx/html/_headers

USER 101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1
ENTRYPOINT ["nginx", "-g", "daemon off;"]
