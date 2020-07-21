# 浏览器渲染过程

`URL`
  -- HTTP -->
    `HTML`
    -- parse -->
      `DOM`
        -- css computing -->
          `DOM with CSS`
            -- layout -->
              `DOM with position`
                -- render -->
                  `Bitmap`


# ISO-OSI 七层网络模型

|  ISO七层网络模型   | TCP/IP网络模型  | Code |
|  ----  | ----  | ---- |
| 应用  | HTTP |  |
| 表示  | HTTP | require('http') |
| 会话  | HTTP |
| 传输  | TCP | require('net') |
| 网络  | Internet | |
| 数据链路  | 4G/5G/Wifi | |
| 物理  | 4G/5G/Wifi | |

# TCP/IP 的一些基础知识

- 流
- 包
- 端口
- IP 地址
- required('net')
- libnet/libpcap

# HTTP

- Request
- Response