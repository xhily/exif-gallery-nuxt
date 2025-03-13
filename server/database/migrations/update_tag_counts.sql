-- 更新现有标签的 photoCount
UPDATE tags
SET photo_count = (
  SELECT COUNT(*)
  FROM photo_tags
  WHERE photo_tags.tag_id = tags.id
);

-- 验证更新结果
SELECT id, name, photo_count
FROM tags
ORDER BY photo_count DESC;
