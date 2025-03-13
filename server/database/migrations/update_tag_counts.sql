UPDATE tags
SET photo_count = (
  SELECT COUNT(*)
  FROM photo_tags
  WHERE photo_tags.tag_id = tags.id
);

SELECT id, name, photo_count
FROM tags
ORDER BY photo_count DESC;
