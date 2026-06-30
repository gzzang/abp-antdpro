import {
  createBook,
  deleteBook,
  getBookList,
  updateBook,
  BookType,
  BookTypeLabels,
} from '@/services/book/api';
import type { BookDto, CreateUpdateBookDto } from '@/services/book/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable, ModalForm, ProFormText, ProFormSelect, ProFormDatePicker, ProFormDigit } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';

const bookTypeOptions = Object.entries(BookTypeLabels).map(([value, label]) => ({
  label,
  value: Number(value),
}));

const BookList: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentBook, setCurrentBook] = useState<BookDto | undefined>();

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id);
      message.success('删除成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: CreateUpdateBookDto) => {
    try {
      if (currentBook) {
        await updateBook(currentBook.id, values);
        message.success('更新成功');
      } else {
        await createBook(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      setCurrentBook(undefined);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error(currentBook ? '更新失败' : '创建失败');
      return false;
    }
  };

  const columns: ProColumns<BookDto>[] = [
    {
      title: '书名',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: '作者',
      dataIndex: 'authorName',
      search: false,
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueEnum: BookTypeLabels,
      search: false,
    },
    {
      title: '出版日期',
      dataIndex: 'publishDate',
      valueType: 'date',
      search: false,
    },
    {
      title: '价格',
      dataIndex: 'price',
      valueType: 'money',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setCurrentBook(record);
            setModalVisible(true);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确定要删除吗？"
          onConfirm={() => handleDelete(record.id)}
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<BookDto>
        headerTitle="图书管理"
        actionRef={actionRef}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              setCurrentBook(undefined);
              setModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params, sort) => {
          const sorting = sort
            ? Object.entries(sort)
                .map(([key, order]) => `${key} ${order === 'ascend' ? 'asc' : 'desc'}`)
                .join(',')
            : undefined;
          const result = await getBookList({
            skipCount: ((params.current || 1) - 1) * (params.pageSize || 10),
            maxResultCount: params.pageSize || 10,
            sorting,
          });
          return {
            data: result.items,
            total: result.totalCount,
            success: true,
          };
        }}
        columns={columns}
        pagination={{
          defaultPageSize: 10,
        }}
      />

      <ModalForm<CreateUpdateBookDto>
        title={currentBook ? '编辑图书' : '新建图书'}
        open={modalVisible}
        onOpenChange={(open) => {
          if (!open) {
            setCurrentBook(undefined);
          }
          setModalVisible(open);
        }}
        initialValues={
          currentBook
            ? {
                name: currentBook.name,
                authorId: currentBook.authorId,
                type: currentBook.type,
                publishDate: currentBook.publishDate,
                price: currentBook.price,
              }
            : {
                type: BookType.Undefined,
              }
        }
        modalProps={{ destroyOnClose: true }}
        onFinish={handleSubmit}
      >
        <ProFormText
          name="name"
          label="书名"
          rules={[{ required: true, message: '请输入书名' }, { max: 128, message: '书名最长128字符' }]}
        />
        <ProFormText
          name="authorId"
          label="作者ID"
          rules={[{ required: true, message: '请输入作者ID' }]}
        />
        <ProFormSelect
          name="type"
          label="类型"
          options={bookTypeOptions}
          rules={[{ required: true, message: '请选择类型' }]}
        />
        <ProFormDatePicker
          name="publishDate"
          label="出版日期"
          rules={[{ required: true, message: '请选择出版日期' }]}
        />
        <ProFormDigit
          name="price"
          label="价格"
          min={0}
          rules={[{ required: true, message: '请输入价格' }]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default BookList;
