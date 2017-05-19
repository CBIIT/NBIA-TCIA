-- To find out how many queries on collection "QIN-BREAST" made on past month 
SELECT * FROM ncia.query_history_attribute ha, ncia.query_history h 
where h.query_history_pk_id = ha.query_history_pk_id and ha.attribute_value = 'QIN-BREAST' and h.query_execute_timestamp >= NOW() - INTERVAL 1 MONTH;